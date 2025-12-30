const CACHE_NAME = 'countenance-v1';
const DYNAMIC_CACHE = 'countenance-dynamic-v1';

const ASSETS = [
    '/',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => {
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/) || url.pathname.startsWith('/_next/image')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((networkResponse) => {
                    if (
                        !networkResponse ||
                        (networkResponse.status !== 200 && networkResponse.type !== 'opaque')
                    ) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                }).catch(() => {
                });
            })
        );
        return;
    }

    if (url.hostname.includes('contentful.com') || url.hostname.includes('ctfassets.net')) {
        event.respondWith(
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(DYNAMIC_CACHE).then((cache) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(event.request).then((response) => {
                        return response || caches.match('/');
                    });
                })
        );
        return;
    }


    event.respondWith(
        caches.open(DYNAMIC_CACHE).then((cache) => {
            return cache.match(event.request).then((response) => {
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch((err) => {
                    });
                return response || fetchPromise;
            });
        })
    );
});
