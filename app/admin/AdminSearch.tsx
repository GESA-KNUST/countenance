'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, EyeOff } from 'lucide-react';
import type { SearchableEntry } from '@/lib/admin/entries';

export interface SearchableSection {
    label: string;
    hint: string;
    href: string;
}

interface AdminSearchProps {
    entries: SearchableEntry[];
    sections: SearchableSection[];
    children: React.ReactNode;
}

const MAX_RESULTS = 40;

const AdminSearch = ({ entries, sections, children }: AdminSearchProps) => {
    const [query, setQuery] = useState('');
    const trimmed = query.trim().toLowerCase();

    const matchingSections = useMemo(() => {
        if (!trimmed) return [];
        return sections.filter(
            (section) =>
                section.label.toLowerCase().includes(trimmed) ||
                section.hint.toLowerCase().includes(trimmed)
        );
    }, [sections, trimmed]);

    const matchingEntries = useMemo(() => {
        if (!trimmed) return [];
        return entries
            .filter(
                (entry) =>
                    entry.title.toLowerCase().includes(trimmed) ||
                    entry.typeLabel.toLowerCase().includes(trimmed)
            )
            .slice(0, MAX_RESULTS);
    }, [entries, trimmed]);

    const nothingFound =
        trimmed !== '' && matchingSections.length === 0 && matchingEntries.length === 0;

    return (
        <div>
            <div className="mb-8 flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 focus-within:border-black">
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search for anything on the website"
                    aria-label="Search everything"
                    className="min-w-0 flex-1 appearance-none border-0 bg-transparent py-3.5 text-base outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="-mr-1 shrink-0 cursor-pointer rounded-md p-1.5 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </button>
                )}
            </div>

            {trimmed === '' ? (
                children
            ) : (
                <div>
                    {nothingFound && (
                        <p className="text-gray-500 text-sm py-4">
                            Nothing matches &ldquo;{query}&rdquo;.
                        </p>
                    )}

                    {matchingSections.length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500">
                                Sections
                            </h2>
                            <div className="flex flex-col gap-2">
                                {matchingSections.map((section) => (
                                    <Link
                                        key={section.href}
                                        href={section.href}
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-black transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold">{section.label}</p>
                                            <p className="text-sm text-gray-500 truncate">{section.hint}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {matchingEntries.length > 0 && (
                        <div>
                            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-500">
                                Items
                            </h2>
                            <div className="flex flex-col gap-2">
                                {matchingEntries.map((entry) => (
                                    <Link
                                        key={entry.id}
                                        href={`/admin/c/${entry.type}/${entry.id}`}
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-black transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold truncate">{entry.title}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                {entry.typeLabel}
                                                {!entry.published && (
                                                    <>
                                                        <span aria-hidden>&middot;</span>
                                                        <span className="inline-flex items-center gap-1 text-amber-600">
                                                            <EyeOff className="w-3.5 h-3.5" /> Hidden
                                                        </span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {matchingEntries.length === MAX_RESULTS && (
                        <p className="text-xs text-gray-500 mt-4">
                            Showing the first {MAX_RESULTS} matches. Keep typing to narrow it down.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSearch;
