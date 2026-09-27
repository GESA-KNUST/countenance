import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { findCollection } from '@/lib/admin/collections';
import { listEntries } from '@/lib/admin/entries';
import EntryList from '../../EntryList';

export const dynamic = 'force-dynamic';

const CollectionList = async ({ params }: { params: Promise<{ type: string }> }) => {
    const { type } = await params;
    const collection = findCollection(type);
    if (!collection) notFound();

    const entries = await listEntries(type);

    if (collection.singleton) {
        redirect(`/admin/c/${type}/${entries[0]?.id ?? 'new'}`);
    }

    const backHref = collection.group ? `/admin/g/${collection.group}` : '/admin';
    const backLabel = collection.group ?? 'Everything';

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4" /> {backLabel}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold font-header">{collection.label}</h1>
            <p className="text-gray-600 text-sm mt-1 mb-8">{collection.hint}</p>

            <EntryList collection={collection} entries={entries} />
        </div>
    );
};

export default CollectionList;
