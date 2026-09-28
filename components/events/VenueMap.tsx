'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { googleMapsLink } from '@/lib/map';

interface VenueMapProps {
    lat: number;
    lon: number;
    label?: string;
    className?: string;
}

export { googleMapsLink };

const VenueMap = ({ lat, lon, label, className = 'h-[400px]' }: VenueMapProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative w-full bg-gray-50 ${className}`}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
                </div>
            )}

            <iframe
                title={label ? `Map showing ${label}` : 'Map showing the venue'}
                src={`https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`}
                className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
            />

            <a
                href={googleMapsLink(lat, lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
            >
                <ExternalLink className="h-3.5 w-3.5" />
                Directions
            </a>
        </div>
    );
};

export default VenueMap;
