import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { findAdminPage } from '@/lib/admin/pages';
import { readHeroEntry } from '@/lib/admin/contentful-write';
import HeroEditor from '../HeroEditor';

export const dynamic = 'force-dynamic';

const AdminPageEditor = async ({ params }: { params: Promise<{ pageKey: string }> }) => {
    const { pageKey } = await params;
    const page = findAdminPage(pageKey);
    if (!page) notFound();

    const entry = await readHeroEntry(page.key);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> All pages
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold font-header">{page.label}</h1>
            <p className="text-gray-600 text-sm mt-1 mb-8">{page.hint}</p>

            <HeroEditor
                pageKey={page.key}
                livePath={page.path}
                initialImages={entry.images}
                initialMobileImages={entry.mobileImages}
            />
        </div>
    );
};

export default AdminPageEditor;
