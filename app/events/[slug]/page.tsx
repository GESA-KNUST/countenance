import type { Metadata } from 'next';
import { getEventBySlug } from '@/lib/data/event';
import { ogImage } from '@/lib/data/og-image';
import EventDetailClient from './EventDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: 'Event not found' };

    const title = event.title;
    const description =
        event.description?.slice(0, 180) || `${event.title} — a GESA-KNUST event.`;
    const share = ogImage(event.eventImage?.url, event.eventImage?.description || event.title);

    return {
        title,
        description,
        openGraph: { title, description, type: 'article', images: share },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: share.map((image) => image.url),
        },
    };
}

const EventDetailPage = () => <EventDetailClient />;

export default EventDetailPage;
