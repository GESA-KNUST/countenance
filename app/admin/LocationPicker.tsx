'use client';
import { useState } from 'react';
import { Crosshair, ExternalLink, MapPin, X } from 'lucide-react';
import {
    isShortGoogleMapsLink,
    parseGoogleMapsLink,
    type Point,
} from '@/lib/admin/google-maps-link';

interface LocationPickerProps {
    value: Point | null;
    onChange: (value: Point | null) => void;
}

const SEARCH_ON_GOOGLE = 'https://www.google.com/maps/search/?api=1&query=KNUST+Kumasi';

const embedUrl = (point: Point) =>
    `https://maps.google.com/maps?q=${point.lat},${point.lon}&z=16&output=embed`;

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
    const [link, setLink] = useState('');
    const [note, setNote] = useState('');
    const [working, setWorking] = useState(false);

    const apply = async () => {
        const pasted = link.trim();
        if (!pasted) return;

        setNote('');

        const direct = parseGoogleMapsLink(pasted);
        if (direct) {
            onChange(direct);
            setLink('');
            return;
        }

        if (!isShortGoogleMapsLink(pasted)) {
            setNote(
                'That does not look like a Google Maps link. Open the place in Google Maps and copy the link from the address bar.'
            );
            return;
        }

        setWorking(true);
        try {
            const res = await fetch('/api/admin/resolve-map-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: pasted }),
            });
            const payload = (await res.json()) as Partial<Point> & { message?: string };

            if (!res.ok || typeof payload.lat !== 'number' || typeof payload.lon !== 'number') {
                setNote(payload.message ?? 'Could not read that link. Try the long link instead.');
                return;
            }

            onChange({ lat: payload.lat, lon: payload.lon });
            setLink('');
        } catch {
            setNote('No internet connection. Try again.');
        } finally {
            setWorking(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <p className="mb-2">
                    Find the place on{' '}
                    <a
                        href={SEARCH_ON_GOOGLE}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-gray-900 underline"
                    >
                        Google Maps <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    , then give us either one:
                </p>
                <ul className="flex flex-col gap-1.5">
                    <li>
                        <span className="font-semibold text-gray-900">On a computer</span> &mdash;
                        copy the whole link from the address bar at the top of the browser.
                    </li>
                    <li>
                        <span className="font-semibold text-gray-900">On a phone</span> &mdash; press
                        and hold the exact spot on the map. Google shows two numbers like{' '}
                        <span className="font-mono text-gray-900">6.67450, -1.57160</span>. Copy
                        those.
                    </li>
                </ul>
                <p className="mt-2 text-gray-500">
                    The Share button&apos;s short link often works too, but the two above are always
                    exact.
                </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-3.5 focus-within:border-black">
                    <input
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                apply();
                            }
                        }}
                        placeholder="Paste the Google Maps link here"
                        className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-2.5 text-base outline-none"
                    />
                    {link && (
                        <button
                            type="button"
                            onClick={() => {
                                setLink('');
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
                    onClick={apply}
                    disabled={working || link.trim().length === 0}
                    className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-black disabled:opacity-40"
                >
                    <MapPin className="h-4 w-4" />
                    {working ? 'Reading link...' : 'Use this place'}
                </button>
            </div>

            {note && <p className="text-sm text-red-600">{note}</p>}

            {value && (
                <div className="h-72 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <iframe
                        key={`${value.lat},${value.lon}`}
                        title="The place you chose"
                        src={embedUrl(value)}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                {value ? (
                    <p className="flex items-center gap-1.5 text-gray-600">
                        <Crosshair className="h-4 w-4 text-gray-400" />
                        Pin set at {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
                    </p>
                ) : (
                    <p className="text-gray-500">
                        No place chosen yet. The event will show without a map.
                    </p>
                )}

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="cursor-pointer text-gray-500 underline hover:text-black"
                    >
                        Remove the place
                    </button>
                )}
            </div>
        </div>
    );
};

export default LocationPicker;
