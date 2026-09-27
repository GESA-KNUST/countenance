'use client';
import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Crosshair, X } from 'lucide-react';
import { PIN_HTML, TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from '@/lib/map';

type Point = { lat: number; lon: number };

interface LocationPickerProps {
    value: Point | null;
    onChange: (value: Point | null) => void;
}

const KNUST: Point = { lat: 6.6745, lon: -1.5716 };


interface Suggestion {
    label: string;
    lat: number;
    lon: number;
}

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
    const container = useRef<HTMLDivElement>(null);
    const mapRef = useRef<unknown>(null);
    const markerRef = useRef<unknown>(null);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Suggestion[]>([]);
    const [searching, setSearching] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const leaflet = await import('leaflet');
            if (cancelled || !container.current || mapRef.current) return;

            const start = value ?? KNUST;
            const map = leaflet.map(container.current, {
                center: [start.lat, start.lon],
                zoom: value ? 16 : 14,
                scrollWheelZoom: false,
            });

            leaflet
                .tileLayer(TILE_URL, { maxZoom: TILE_MAX_ZOOM, attribution: TILE_ATTRIBUTION })
                .addTo(map);

            const pin = leaflet.divIcon({
                className: '',
                html: PIN_HTML,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
            });

            const place = (point: Point) => {
                const existing = markerRef.current as { setLatLng: (p: [number, number]) => void } | null;
                if (existing) {
                    existing.setLatLng([point.lat, point.lon]);
                    return;
                }

                markerRef.current = leaflet
                    .marker([point.lat, point.lon], { icon: pin, draggable: true })
                    .addTo(map)
                    .on('dragend', (event: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
                        const next = event.target.getLatLng();
                        onChange({ lat: Number(next.lat.toFixed(6)), lon: Number(next.lng.toFixed(6)) });
                    });
            };

            if (value) place(value);

            map.on('click', (event: { latlng: { lat: number; lng: number } }) => {
                const point = {
                    lat: Number(event.latlng.lat.toFixed(6)),
                    lon: Number(event.latlng.lng.toFixed(6)),
                };
                place(point);
                onChange(point);
            });

            mapRef.current = map;
            setTimeout(() => map.invalidateSize(), 60);
        };

        load();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const map = mapRef.current as { setView: (c: [number, number], z: number) => void } | null;
        if (!map || !value) return;
        map.setView([value.lat, value.lon], 16);
    }, [value]);

    const search = async () => {
        const term = query.trim();
        if (term.length < 3) return;

        setSearching(true);
        setNote('');
        setResults([]);

        try {
            const res = await fetch(`/api/admin/geocode?q=${encodeURIComponent(term)}`);
            const payload = (await res.json()) as { results?: Suggestion[]; message?: string };

            if (!res.ok) {
                setNote(payload.message ?? 'Could not search right now. Tap the map to place the pin instead.');
                return;
            }

            const found = payload.results ?? [];
            if (found.length === 0) {
                setNote('No place found with that name. Try a nearby landmark, or tap the map.');
            }
            setResults(found);
        } catch {
            setNote('Could not search right now. Tap the map to place the pin instead.');
        } finally {
            setSearching(false);
        }
    };

    const choose = (suggestion: Suggestion) => {
        const point = {
            lat: Number(suggestion.lat.toFixed(6)),
            lon: Number(suggestion.lon.toFixed(6)),
        };
        const map = mapRef.current as { setView: (c: [number, number], z: number) => void } | null;
        map?.setView([point.lat, point.lon], 16);

        const marker = markerRef.current as { setLatLng: (p: [number, number]) => void } | null;
        marker?.setLatLng([point.lat, point.lon]);

        onChange(point);
        setResults([]);
        setQuery(suggestion.label.split(',')[0]);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-3.5 focus-within:border-black">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                search();
                            }
                        }}
                        placeholder="Search a place, e.g. Engineering Auditorium KNUST"
                        className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-2.5 text-base outline-none"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                setNote('');
                            }}
                            aria-label="Clear"
                            className="-mr-1 shrink-0 cursor-pointer rounded-md p-1 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={search}
                    disabled={searching || query.trim().length < 3}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-black disabled:opacity-40 cursor-pointer"
                >
                    <Search className="h-4 w-4" />
                    {searching ? 'Searching...' : 'Find'}
                </button>
            </div>

            {results.length > 0 && (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {results.map((item) => (
                        <li key={`${item.lat}-${item.lon}`}>
                            <button
                                type="button"
                                onClick={() => choose(item)}
                                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50 cursor-pointer"
                            >
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                <span className="min-w-0">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div
                ref={container}
                className="h-72 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                {value ? (
                    <p className="flex items-center gap-1.5 text-gray-600">
                        <Crosshair className="h-4 w-4 text-gray-400" />
                        Pin set at {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
                    </p>
                ) : (
                    <p className="text-gray-500">Tap the map to drop a pin, or search for the place.</p>
                )}

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="text-gray-500 underline hover:text-black cursor-pointer"
                    >
                        Clear the pin
                    </button>
                )}
            </div>

            {note && <p className="text-sm text-amber-700">{note}</p>}
        </div>
    );
};

export default LocationPicker;
