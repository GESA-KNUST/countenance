'use client';

import { useParams } from 'next/navigation';
import { useEventBySlug } from '@/hooks/useEventCollection';
import EventDetail from '@/components/events/EventDetail';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import NotFoundCard from '@/components/common/NotFoundCard';
import { CalendarX } from 'lucide-react';

const EventDetailPage = () => {
    const { slug } = useParams();
    const { data: event, isLoading, error } = useEventBySlug(slug as string);
    const { addToRecentlyViewed } = useStore();

    useEffect(() => {
        if (event && slug) {
            addToRecentlyViewed(`/events/${slug}`);
        }
    }, [event, slug, addToRecentlyViewed]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <div className="h-[400px] bg-gray-200 rounded-3xl"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <NotFoundCard
                icon={CalendarX}
                title="Event Not Found"
                message="The event you are looking for might have been moved or deleted."
                backHref="/events"
                backText="Back to Events"
            />
        );
    }

    return <EventDetail event={event} />;
};

export default EventDetailPage;
