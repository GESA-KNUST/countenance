import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'GESA-KNUST',
        short_name: 'GESA',
        description: 'Ghana Engineering Students Association - KNUST',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#FFFFFF',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/images/logo.svg',
                sizes: '192x192 512x512',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/images/logo.svg',
                sizes: '192x192 512x512',
                type: 'image/svg+xml',
                purpose: 'maskable',
            },
        ],
    };
}
