import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.gesaknust.com';

    // Define static routes
    const routes = [
        '',
        '/events',
        '/clubs',
        '/blog',
        '/gallery',
        '/executives',
        '/hub',
        '/contact-us',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return routes;
}
