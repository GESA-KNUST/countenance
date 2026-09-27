'use client';
import { useEffect, useState } from 'react';

const PUBLIC_SITE = 'https://www.gesaknust.com';

function isAdminHost(hostname: string) {
    if (hostname === 'localhost' || hostname === '127.0.0.1') return false;
    return hostname.startsWith('web-admin.') || hostname.startsWith('admin.');
}

/**
 * On the admin subdomain the whole app is still served, so links would keep you
 * there. This returns the public site's origin so navigation leaves the
 * dashboard, and an empty string everywhere else.
 */
export function useSiteBase() {
    const [base, setBase] = useState('');

    useEffect(() => {
        if (isAdminHost(window.location.hostname)) setBase(PUBLIC_SITE);
    }, []);

    return base;
}

export function siteLink(base: string, href: string) {
    if (!base) return href;
    if (!href.startsWith('/')) return href;
    return `${base}${href}`;
}
