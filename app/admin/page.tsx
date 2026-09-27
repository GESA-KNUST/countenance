import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Images } from 'lucide-react';
import { ADMIN_PAGES } from '@/lib/admin/pages';
import { readAllHeroEntries } from '@/lib/admin/contentful-write';
import { searchableEntries } from '@/lib/admin/entries';
import { submissionsFrom } from '@/lib/admin/submissions';
import { isWriteConfigured } from '@/lib/admin/cma';
import { collectionGroups, ungroupedCollections } from '@/lib/admin/collections';
import LogoutButton from './LogoutButton';
import AdminSearch, { type SearchableSection } from './AdminSearch';

export const dynamic = 'force-dynamic';

const AdminHome = async () => {
    if (!isWriteConfigured()) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <h1 className="text-2xl font-bold font-header mb-2">Almost ready</h1>
                <p className="text-gray-600">
                    This needs to be connected to Contentful before it can be used. Ask a
                    developer to add the Contentful token.
                </p>
            </div>
        );
    }

    const [entries, index] = await Promise.all([readAllHeroEntries(), searchableEntries()]);
    const allEntries = index.entries;
    const submissions = await submissionsFrom(index.raw);

    const pages = ADMIN_PAGES.map((page) => ({
        ...page,
        entry: entries[page.key] ?? { images: [], mobileImages: [] },
    }));

    const sections: SearchableSection[] = [
        ...collectionGroups().map((group) => ({
            label: group.name,
            hint: group.hint,
            href: `/admin/g/${group.name}`,
        })),
        ...ungroupedCollections().map((collection) => ({
            label: collection.label,
            hint: collection.hint,
            href: `/admin/c/${collection.type}`,
        })),
        ...ADMIN_PAGES.map((page) => ({
            label: `${page.label} photos`,
            hint: page.hint,
            href: `/admin/${page.key}`,
        })),
        {
            label: 'Blog submissions',
            hint: 'Articles people sent in for review',
            href: '/admin/submissions',
        },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <div className="flex items-start justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-header">GESA website</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Change anything on the website from here.
                    </p>
                </div>
                <LogoutButton />
            </div>

            <AdminSearch entries={allEntries} sections={sections}>
                {submissions.length > 0 && (
                <Link
                    href="/admin/submissions"
                    className="bg-[#FFBE00]/15 border border-[#FFBE00] rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-black transition-colors mb-8"
                >
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold">
                            {submissions.length} blog submission{submissions.length === 1 ? '' : 's'} waiting
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                            Read, approve or turn down articles people sent in
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 shrink-0" />
                </Link>
            )}

            <h2 className="font-semibold mb-1">Content</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Blog posts, events, photos and everything else.
                </p>
                <div className="flex flex-col gap-2 mb-12">
                    {collectionGroups().map((group) => (
                        <Link
                            key={group.name}
                            href={`/admin/g/${group.name}`}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-black transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{group.name}</p>
                                <p className="text-sm text-gray-500 truncate">{group.hint}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </Link>
                    ))}

                    {ungroupedCollections().map((collection) => (
                        <Link
                            key={collection.type}
                            href={`/admin/c/${collection.type}`}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-black transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{collection.label}</p>
                                <p className="text-sm text-gray-500 truncate">{collection.hint}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </Link>
                    ))}
                </div>

                <h2 className="font-semibold mb-1 flex items-center gap-2">
                    <Images className="w-4 h-4" /> Page photos
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    The big photos that slide across the top of each page.
                </p>
                <div className="flex flex-col gap-2">
                    {pages.map((page) => (
                        <Link
                            key={page.key}
                            href={`/admin/${page.key}`}
                            className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-4 hover:border-black transition-colors"
                        >
                            <div className="flex -space-x-3 shrink-0">
                                {page.entry.images.slice(0, 3).map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100"
                                    >
                                        <Image
                                            src={`${image.url}?w=80&h=80&fit=fill&fm=jpg`}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                                {page.entry.images.length === 0 && (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{page.label}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {page.entry.images.length} photo
                                    {page.entry.images.length === 1 ? '' : 's'}
                                </p>
                            </div>

                            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </Link>
                    ))}
                </div>
            </AdminSearch>
        </div>
    );
};

export default AdminHome;
