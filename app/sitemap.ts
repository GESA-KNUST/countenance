import { MetadataRoute } from 'next';
import {
    currentAcademicYear,
    executiveSlug,
    getExecutives,
    hasProfile,
    isCurrentYear,
    type Executive,
} from '@/lib/data/executive';
import { getBlogsSafe } from '@/lib/data/blog';
import { getEventsSafe } from '@/lib/data/event';
import { getClubsSafe } from '@/lib/data/club';
import { departmentIndex, facultyIndex } from '@/lib/data/org-index';
import { getPersonalityOfTheWeek, personalitySlug } from '@/lib/data/potw';
import { teamMembers } from '@/lib/data/team';
import { blogHref } from '@/lib/data/blog-link';
import { SITE_URL } from '@/lib/seo/site';

type Entry = MetadataRoute.Sitemap[number];

function toDate(value: string | null | undefined) {
    const stamp = value ? Date.parse(value) : NaN;
    return Number.isNaN(stamp) ? null : new Date(stamp);
}

function publishedAt(executive: Executive) {
    return toDate(executive.sys.publishedAt);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    const [executives, posts, events, clubs, departments, faculties, personalities] =
        await Promise.all([
            getExecutives(),
            getBlogsSafe(),
            getEventsSafe(),
            getClubsSafe(),
            departmentIndex(),
            facultyIndex(),
            getPersonalityOfTheWeek(),
        ]);

    const currentYear = currentAcademicYear(executives);
    const profiles = executives.filter(hasProfile);

    const latestExecutiveChange = profiles
        .map(publishedAt)
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    const latestPost = posts
        .map((post) => toDate(post.datePublished))
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    const lastModifiedFor: Record<string, Date | undefined> = {
        '/executives': latestExecutiveChange,
        '/blog': latestPost,
    };

    const routes: Entry[] = [
        '',
        '/events',
        '/clubs',
        '/blog',
        '/gallery',
        '/executives',
        '/hubs',
        '/team',
        '/department',
        '/faculty',
        '/contact-us',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: lastModifiedFor[route] ?? new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    const executiveRoutes: Entry[] = profiles.map((executive) => {
        const serving = isCurrentYear(executive.academicYear, currentYear);

        return {
            url: `${baseUrl}/executives/${executiveSlug(executive)}`,
            lastModified: publishedAt(executive) ?? latestExecutiveChange ?? new Date(),
            changeFrequency: serving ? 'monthly' : 'yearly',
            priority: serving ? 0.7 : 0.3,
        };
    });

    const blogRoutes: Entry[] = posts
        .map((post) => ({ post, href: blogHref(post.slug) }))
        .filter((entry): entry is { post: (typeof posts)[number]; href: string } =>
            Boolean(entry.href)
        )
        .map(({ post, href }) => ({
            url: `${baseUrl}${href}`,
            lastModified: toDate(post.datePublished) ?? undefined,
            changeFrequency: 'monthly',
            priority: 0.6,
        }));

    const eventRoutes: Entry[] = events
        .filter((event) => Boolean(event.slug))
        .map((event) => ({
            url: `${baseUrl}/events/${encodeURIComponent(event.slug)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

    const clubRoutes: Entry[] = clubs.map((club) => ({
        url: `${baseUrl}/clubs/${club.sys.id}`,
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    const departmentRoutes: Entry[] = departments.map((department) => ({
        url: `${baseUrl}/departments/${department.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const facultyRoutes: Entry[] = faculties.map((faculty) => ({
        url: `${baseUrl}/faculties/${faculty.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const personalityRoutes: Entry[] = (personalities ?? []).map((person) => ({
        url: `${baseUrl}/personality/${personalitySlug(person)}`,
        changeFrequency: 'weekly',
        priority: 0.5,
    }));

    const teamRoutes: Entry[] = teamMembers.map((member) => ({
        url: `${baseUrl}/team/${member.slug}`,
        changeFrequency: 'yearly',
        priority: 0.3,
    }));

    return [
        ...routes,
        ...executiveRoutes,
        ...blogRoutes,
        ...eventRoutes,
        ...clubRoutes,
        ...departmentRoutes,
        ...facultyRoutes,
        ...personalityRoutes,
        ...teamRoutes,
    ];
}
