import Link from 'next/link';
import { ArrowLeft, Inbox } from 'lucide-react';
import { listSubmissions } from '@/lib/admin/submissions';
import { isWriteConfigured } from '@/lib/admin/cma';
import SubmissionCard from './SubmissionCard';

export const dynamic = 'force-dynamic';

const SubmissionsPage = async () => {
    const submissions = isWriteConfigured() ? await listSubmissions() : [];

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6">
                <ArrowLeft className="w-4 h-4" /> Everything
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold font-header">Blog submissions</h1>
            <p className="text-gray-600 text-sm mt-1 mb-8">
                Articles people sent in. Nothing here is on the website until you approve it.
            </p>

            {submissions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Inbox className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>Nothing waiting for review.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {submissions.map((submission) => (
                        <SubmissionCard key={submission.id} submission={submission} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionsPage;
