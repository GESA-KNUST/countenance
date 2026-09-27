'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface VenueMapProps {
    lat: number;
    lon: number;
    label?: string;
    className?: string;
}

// Google's keyless embed now demands an API key, and OpenStreetMap blocks its
// own tiles for application use, so the venue is drawn with Carto's tiles and
// the "Open in Google Maps" link hands the visitor over to the real app for
// directions.
const TILE_URL = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const googleMapsLink = (lat: number, lon: number) =>
    `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

const VenueMap = ({ lat, lon, label, className = 'h-[400px]' }: VenueMapProps) => {
    const container = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
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
                    .tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION })
                    .addTo(instance);

                leaflet
                    .marker([lat, lon], {
                        icon: leaflet.divIcon({
                            className: '',
                            html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#FFBE00;border:3px solid #252638;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>',
                            iconSize: [22, 22],
                            iconAnchor: [11, 11],
                        }),
                    })
                    .addTo(instance);

                setTimeout(() => instance.invalidateSize(), 60);
                setReady(true);
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

            {!ready && !failed && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
                </div>
            )}

            {failed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
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
                className="absolute top-3 right-3 z-[1000] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
            >
                <ExternalLink className="h-3.5 w-3.5" />
                {label ? `Directions to ${label}` : 'Open in Google Maps'}
            </a>
        </div>
    );
};

export default VenueMap;
