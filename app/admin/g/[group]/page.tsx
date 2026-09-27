import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { findGroup } from '@/lib/admin/collections';
import { listEntries } from '@/lib/admin/entries';
import EntryList from '../../EntryList';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ group: string }>;
    searchParams: Promise<{ tab?: string }>;
}

const GroupPage = async ({ params, searchParams }: Props) => {
    const { group: groupName } = await params;
    const { tab } = await searchParams;

    const group = findGroup(groupName);
    if (!group) notFound();

    const active =
        group.collections.find((collection) => collection.type === tab) ?? group.collections[0];

    const entries = await listEntries(active.type);

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4" /> Everything
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold font-header">{group.name}</h1>
            <p className="text-gray-600 text-sm mt-1 mb-6">{group.hint}</p>

            {group.collections.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
                {group.collections.map((collection) => {
                    const isActive = collection.type === active.type;
                    return (
                        <Link
                            key={collection.type}
                            href={`/admin/g/${group.name}?tab=${collection.type}`}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                                isActive
                                    ? 'bg-[#252638] text-white border-[#252638]'
                                    : 'bg-white text-[#252638] border-gray-300 hover:border-black'
                            }`}
                        >
                            {collection.label}
                        </Link>
                    );
                })}
            </div>
            )}

            <p className="text-sm text-gray-500 mb-4">{active.hint}</p>

            <EntryList collection={active} entries={entries} />
        </div>
    );
};

export default GroupPage;
