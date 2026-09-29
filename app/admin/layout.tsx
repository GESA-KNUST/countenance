import type { Metadata } from 'next';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { currentManager } from '@/lib/admin/session';
import LoginForm from './LoginForm';
import TokenNotice from './TokenNotice';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Website manager',
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = (await headers()).get('x-pathname') ?? '';

    if (pathname.startsWith('/admin/invite/')) {
        return <div className="min-h-screen bg-gray-50 font-poppins">{children}</div>;
    }

    if (!(await currentManager())) {
        return (
            <Suspense>
                <LoginForm />
            </Suspense>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            <TokenNotice />
            {children}
        </div>
    );
}
