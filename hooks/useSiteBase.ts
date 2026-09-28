'use client';
import { useEffect, useState } from 'react';

const PUBLIC_SITE = 'https://www.gesaknust.com';

function isAdminHost(hostname: string) {
    if (hostname === 'localhost' || hostname === '127.0.0.1') return false;
    return hostname.startsWith('web-admin.') || hostname.startsWith('admin.');
}

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
