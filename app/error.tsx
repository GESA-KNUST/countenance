'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { LogError } from '@/lib/logger';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        LogError('Unhandled route error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-4 font-header text-gray-900">Something went wrong</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    An unexpected error occurred while loading this page. Please try again.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-block bg-gray-100 text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
