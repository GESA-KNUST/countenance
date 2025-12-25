import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'GESA-KNUST',
        short_name: 'GESA',
        description: 'Ghana Engineering Students Association - KNUST',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#FFBE00',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/images/logo.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}
