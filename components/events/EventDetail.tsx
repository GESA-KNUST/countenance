'use client';

import Image from 'next/image';
import { MapPin, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { EventItem } from '@/hooks/useEventCollection';
import Link from 'next/link';
import { useState } from 'react';

interface EventDetailProps {
    event: EventItem;
}

const EventDetail: React.FC<EventDetailProps> = ({ event }) => {
    const [mapLoading, setMapLoading] = useState(true);

    const { title, description, eventDate, eventImage, venue, onlineLink } = event;

    const dateObj = new Date(eventDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: 'long',
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit',
    });

    const googleMapsUrl = `https://maps.google.com/maps?q=${venue.lat},${venue.lon}&output=embed`;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[40vh] sm:h-[60vh] w-full">
                <Image
                    src={eventImage.url}
                    alt={eventImage.description || title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Events</span>
                        </Link>
                        <h1 className="font-header text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            {title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-white/90">
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                <Calendar className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                <MapPin className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium">Join us Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-header">About the Event</h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                {description.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 leading-relaxed whitespace-pre-wrap">{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Map Section */}
                        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="p-8 sm:p-10 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 font-header">Event Location</h2>
                                <p className="text-gray-500 mt-1">Join us at our physical location or follow the map below.</p>
                            </div>
                            <div className="relative h-[400px] w-full bg-gray-50">
                                {mapLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={googleMapsUrl}
                                    allowFullScreen
                                    loading="lazy"
                                    className={`border-0 w-full h-full transition-opacity duration-300 ${mapLoading ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => setMapLoading(false)}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-header">Event Details</h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="bg-yellow-50 p-3 rounded-2xl h-fit">
                                        <Calendar className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Date & Time</h4>
                                        <p className="text-gray-600 text-sm">{formattedDate}</p>
                                        <p className="text-gray-600 text-sm font-medium mt-1">{formattedTime}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-blue-50 p-3 rounded-2xl h-fit">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Venue</h4>
                                        <p className="text-gray-600 text-sm">Where the event is taking place</p>
                                    </div>
                                </div>

                                {onlineLink && (
                                    <div className="pt-6 border-t border-gray-100">
                                        <Link
                                            href={onlineLink}
                                            target="_blank"
                                            className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" />
                                            <span className="relative z-10">Register / Access Event</span>
                                        </Link>
                                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-center text-xs text-gray-500 leading-relaxed italic">
                                                Click above to register, join the live stream, or access exclusive event resources.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
