'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ChevronRight, X, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
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
                    <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-3.5 focus-within:border-black">
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={`Search ${collection.label.toLowerCase()}`}
                            className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-2.5 text-base outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                                className="-mr-1 shrink-0 cursor-pointer rounded-md p-1 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4 text-gray-500" />
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

            {reorderable && (
                <p className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    <ArrowUpDown className="h-4 w-4 shrink-0 text-gray-400" />
                    This is the order they appear on the website. Use the arrows to move things up or
                    down &mdash; it saves straight away.
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
                        className="bg-white border border-gray-200 rounded-xl flex items-center gap-2 pr-3 hover:border-black transition-colors"
                    >
                        {reorderable && (
                            <div className="flex flex-col items-center gap-0.5 self-stretch justify-center border-r border-gray-100 py-2 pl-2 pr-2.5">
                                <button
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0 || savingOrder}
                                    aria-label={`Move ${entry.title} up`}
                                    title="Move up"
                                    className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-20 cursor-pointer"
                                >
                                    <ChevronUp className="h-4 w-4" />
                                </button>
                                <span className="text-[11px] font-semibold text-gray-400 tabular-nums">
                                    {index + 1}
                                </span>
                                <button
                                    onClick={() => move(index, 1)}
                                    disabled={index === filtered.length - 1 || savingOrder}
                                    aria-label={`Move ${entry.title} down`}
                                    title="Move down"
                                    className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-black disabled:opacity-20 cursor-pointer"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        )}
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

                        <VisibilityToggle id={entry.id} published={entry.published} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EntryList;
