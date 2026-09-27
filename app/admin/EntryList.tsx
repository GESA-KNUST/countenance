'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ChevronRight, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import type { CollectionSpec } from '@/lib/admin/collections';
import type { EntrySummary } from '@/lib/admin/entries';
import VisibilityToggle from './VisibilityToggle';

interface EntryListProps {
    collection: CollectionSpec;
    entries: EntrySummary[];
}

const SEARCH_THRESHOLD = 6;

const EntryList = ({ collection, entries }: EntryListProps) => {
    const [query, setQuery] = useState('');
    const [ordered, setOrdered] = useState(entries);
    const [savingOrder, setSavingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');

    useEffect(() => {
        setOrdered(entries);
    }, [entries]);

    const move = async (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= ordered.length) return;

        const next = [...ordered];
        [next[index], next[target]] = [next[target], next[index]];
        setOrdered(next);
        setOrderError('');
        setSavingOrder(true);

        try {
            const res = await fetch('/api/admin/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: collection.type, ids: next.map((entry) => entry.id) }),
            });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                setOrderError(payload.message ?? 'The new order could not be saved.');
                setOrdered(entries);
            }
        } catch {
            setOrderError('No internet connection. The new order was not saved.');
            setOrdered(entries);
        }

        setSavingOrder(false);
    };

    const filtered = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return ordered;
        return ordered.filter((entry) => entry.title.toLowerCase().includes(trimmed));
    }, [ordered, query]);

    const reorderable = query.trim() === '' && ordered.length > 1;

    const showSearch = entries.length >= SEARCH_THRESHOLD;

    return (
        <div>
            <div className="flex items-center gap-3 mb-5">
                {showSearch && (
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={`Search ${collection.label.toLowerCase()}`}
                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-base outline-none focus:border-black [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        )}
                    </div>
                )}

                {!collection.singleton && (
                    <Link
                        href={`/admin/c/${collection.type}/new`}
                        className="bg-primary text-black font-semibold rounded-lg px-4 py-2.5 text-sm flex items-center gap-1.5 hover:scale-[1.02] transition-transform shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Add {collection.singular}
                    </Link>
                )}
            </div>

            {entries.length === 0 && (
                <p className="text-gray-500 text-sm py-4">
                    Nothing here yet. Press Add to create the first one.
                </p>
            )}

            {orderError && <p className="text-sm text-red-600 mb-3">{orderError}</p>}

            {entries.length > 0 && filtered.length === 0 && (
                <p className="text-gray-500 text-sm py-4">
                    Nothing matches &ldquo;{query}&rdquo;.
                </p>
            )}

            <div className="flex flex-col gap-3">
                {filtered.map((entry, index) => (
                    <div
                        key={entry.id}
                        className="bg-white border border-gray-200 rounded-xl flex items-center gap-3 pr-3 hover:border-black transition-colors"
                    >
                        <Link
                            href={`/admin/c/${collection.type}/${entry.id}`}
                            className="flex items-center gap-4 p-4 flex-1 min-w-0"
                        >
                            {collection.thumbField && (
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    {entry.thumbUrl && (
                                        <Image
                                            src={`${entry.thumbUrl}?w=96&h=96&fit=fill&fm=jpg`}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                            unoptimized
                                        />
                                    )}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold truncate">{entry.title}</p>
                                <p className="text-sm text-gray-500">
                                    {entry.published ? 'On the website' : 'Hidden'} &middot; changed{' '}
                                    {new Date(entry.updatedAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </Link>

                        {reorderable && (
                            <div className="flex flex-col shrink-0">
                                <button
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0 || savingOrder}
                                    aria-label={`Move ${entry.title} up`}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => move(index, 1)}
                                    disabled={index === filtered.length - 1 || savingOrder}
                                    aria-label={`Move ${entry.title} down`}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <VisibilityToggle id={entry.id} published={entry.published} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EntryList;
