/*
 * GESA-KNUST service worker.
 *
 * Strategy summary:
 *   - Precache: app shell + offline fallback (fault-tolerant, never blocks install).
 *   - Navigations:        network-first  -> cache -> offline.html
 *   - Next static assets: cache-first (immutable, hashed filenames)
 *   - Images (local/CDN): stale-while-revalidate, capped
 *   - Everything else:    stale-while-revalidate, capped
 *   - POST/non-GET & /api: never cached (always hit the network)
 */

const VERSION = 'v2';
const PRECACHE = `countenance-precache-${VERSION}`;
const STATIC_CACHE = `countenance-static-${VERSION}`;
const IMAGE_CACHE = `countenance-images-${VERSION}`;
const RUNTIME_CACHE = `countenance-runtime-${VERSION}`;

const CURRENT_CACHES = [PRECACHE, STATIC_CACHE, IMAGE_CACHE, RUNTIME_CACHE];

const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = ['/', OFFLINE_URL, '/manifest.webmanifest', '/images/logo.png'];

const IMAGE_CACHE_LIMIT = 60;
const RUNTIME_CACHE_LIMIT = 50;

// --- helpers ---------------------------------------------------------------

/** Cache each URL independently so one missing asset can't fail the install. */
async function precache() {
    const cache = await caches.open(PRECACHE);
    await Promise.all(
        PRECACHE_URLS.map((url) =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined)
        )
    );
}

/** Trim a cache to a maximum number of entries (FIFO). */
async function trimCache(cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length <= maxEntries) return;
    for (let i = 0; i < keys.length - maxEntries; i++) {
        await cache.delete(keys[i]);
    }
}

function isImageRequest(request, url) {
    return (
        request.destination === 'image' ||
        /\.(png|jpg|jpeg|svg|gif|webp|avif|ico)$/i.test(url.pathname) ||
        url.hostname.includes('ctfassets.net')
    );
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone());
    }
    return response;
}

async function staleWhileRevalidate(request, cacheName, limit) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const network = fetch(request)
        .then((response) => {
            if (response && (response.ok || response.type === 'opaque')) {
                cache.put(request, response.clone()).then(() => {
                    if (limit) trimCache(cacheName, limit);
                });
            }
            return response;
        })
        .catch(() => undefined);
    return cached || network || fetch(request);
}

async function networkFirstNavigation(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        const offline = await caches.match(OFFLINE_URL);
        return offline || Response.error();
    }
}

// --- lifecycle -------------------------------------------------------------

self.addEventListener('install', (event) => {
    event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => !CURRENT_CACHES.includes(key))
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// --- fetch routing ---------------------------------------------------------

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle GET; let the browser deal with POST/PUT (incl. /api/contentful).
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Never cache API responses — always go to the network so data stays fresh.
    if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
        return;
    }

    // App navigations: network-first with an offline fallback.
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstNavigation(request));
        return;
    }

    // Next.js build assets are content-hashed and immutable: cache-first.
    if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // Images (local or Contentful CDN): stale-while-revalidate, capped.
    if (isImageRequest(request, url)) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, IMAGE_CACHE_LIMIT));
        return;
    }

    // Everything else same-origin: stale-while-revalidate, capped.
    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, RUNTIME_CACHE_LIMIT));
    }
});
