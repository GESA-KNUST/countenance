'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PIN_HTML, TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL, googleMapsLink } from '@/lib/map';

interface VenueMapProps {
    lat: number;
    lon: number;
    label?: string;
    className?: string;
}

export { googleMapsLink };

const VenueMap = ({ lat, lon, label, className = 'h-[400px]' }: VenueMapProps) => {
    const container = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let map: { remove: () => void } | null = null;

        const load = async () => {
            try {
                const leaflet = await import('leaflet');
                if (cancelled || !container.current) return;

                const instance = leaflet.map(container.current, {
                    center: [lat, lon],
                    zoom: 16,
                    scrollWheelZoom: false,
                });
                map = instance;

                leaflet
                    .tileLayer(TILE_URL, { maxZoom: TILE_MAX_ZOOM, attribution: TILE_ATTRIBUTION })
                    .addTo(instance);

                leaflet
                    .marker([lat, lon], {
                        icon: leaflet.divIcon({
                            className: '',
                            html: PIN_HTML,
                            iconSize: [22, 22],
                            iconAnchor: [11, 11],
                        }),
                    })
                    .addTo(instance);

                setTimeout(() => instance.invalidateSize(), 60);
            } catch {
                if (!cancelled) setFailed(true);
            }
        };

        load();

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, [lat, lon]);

    return (
        <div className={`relative w-full bg-gray-50 ${className}`}>
            <div ref={container} className="absolute inset-0 h-full w-full" />

            {failed && (
                <div className="absolute inset-0 z-500 flex flex-col items-center justify-center gap-2 bg-gray-50 p-4 text-center">
                    <p className="font-medium text-gray-600">The map could not load.</p>
                    <a
                        href={googleMapsLink(lat, lon)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 underline"
                    >
                        Open the location in Google Maps
                    </a>
                </div>
            )}

            <a
                href={googleMapsLink(lat, lon)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 z-1000 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
            >
                <ExternalLink className="h-3.5 w-3.5" />
                {label ? `Directions to ${label}` : 'Open in Google Maps'}
            </a>
        </div>
    );
};

export default VenueMap;
