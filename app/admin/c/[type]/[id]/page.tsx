import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { findCollection } from '@/lib/admin/collections';
import { blankEntry, readEntry, referenceOptions, type RefOption } from '@/lib/admin/entries';
import EntryForm from '../../../EntryForm';

export const dynamic = 'force-dynamic';

const EntryPage = async ({ params }: { params: Promise<{ type: string; id: string }> }) => {
    const { type, id } = await params;
    const collection = findCollection(type);
    if (!collection) notFound();

    const isNew = id === 'new';
    const detail = isNew ? blankEntry(collection) : await readEntry(type, id);
    if (!detail) notFound();

    const refTypes = [
        ...new Set(
            collection.fields
                .filter((field) => field.refType)
                .map((field) => field.refType as string)
        ),
    ];
    const loaded = await Promise.all(refTypes.map((refType) => referenceOptions(refType)));
    const refOptions: Record<string, RefOption[]> = {};
    refTypes.forEach((refType, index) => {
        refOptions[refType] = loaded[index];
    });

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <Link
                href={`/admin/c/${type}`}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> {collection.label}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold font-header mb-1">
                {isNew ? `New ${collection.singular}` : `Edit ${collection.singular}`}
            </h1>
            <p className="text-gray-600 text-sm mb-8">
                {detail.published || isNew
                    ? 'Changes go live as soon as you save.'
                    : 'This one is currently hidden from the website.'}
            </p>

            <EntryForm collection={collection} detail={detail} refOptions={refOptions} />
        </div>
    );
};

export default EntryPage;
