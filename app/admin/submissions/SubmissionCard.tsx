'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, X, Pencil } from 'lucide-react';
import StarSpinner from '@/components/ui/StarSpinner';
import type { SubmissionSummary } from '@/lib/admin/submissions';

const SubmissionCard = ({ submission }: { submission: SubmissionSummary }) => {
    const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);
    const [error, setError] = useState('');
    const router = useRouter();

    const act = async (action: 'approve' | 'reject') => {
        setBusy(action);
        setError('');

        try {
            const res = await fetch('/api/admin/submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: submission.id, action }),
            });
            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(payload.message ?? 'That could not be done.');
                setBusy(null);
                return;
            }
            router.refresh();
        } catch {
            setError('No internet connection. Nothing changed.');
        }
        setBusy(null);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex gap-4">
                {submission.coverUrl && (
                    <span className="relative block w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                            src={`${submission.coverUrl}?w=160&h=160&fit=fill&fm=webp&q=80`}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized
                        />
                    </span>
                )}

                <div className="min-w-0 flex-1">
                    <p className="font-semibold">{submission.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{submission.hook}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        From {submission.contributorName}
                        {submission.contributorEmail ? ` · ${submission.contributorEmail}` : ''} ·{' '}
                        {new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            {!submission.hasAuthor && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                    Open it and choose an author before approving.
                </p>
            )}

            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

            <div className="flex flex-wrap items-center gap-2 mt-4">
                <Link
                    href={`/admin/c/blogPost/${submission.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:border-black"
                >
                    <Pencil className="w-4 h-4" /> Read and edit
                </Link>

                <button
                    onClick={() => act('approve')}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center gap-1.5 bg-primary text-black rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:scale-[1.02] transition-transform cursor-pointer min-w-28"
                >
                    {busy === 'approve' ? <StarSpinner /> : <><Check className="w-4 h-4" /> Approve</>}
                </button>

                <button
                    onClick={() => act('reject')}
                    disabled={busy !== null}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-black disabled:opacity-40 cursor-pointer min-w-28"
                >
                    {busy === 'reject' ? <StarSpinner /> : <><X className="w-4 h-4" /> Not for us</>}
                </button>
            </div>
        </div>
    );
};

export default SubmissionCard;
