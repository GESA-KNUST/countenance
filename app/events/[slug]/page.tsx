'use client';

import { useParams } from 'next/navigation';
import { useEventBySlug } from '@/hooks/useEventCollection';
import EventDetail from '@/components/events/EventDetail';
import SkeletonLoadingCard from '@/components/events/SkeletonLoadingCard';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 font-header">Event Not Found</h1>
                    <p className="text-gray-600 mb-8">The event you are looking for might have been moved or deleted.</p>
                    <a href="/events" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                        Back to Events
                    </a>
                </div>
            </div>
        );
    }

    return <EventDetail event={event} />;
};

export default EventDetailPage;
