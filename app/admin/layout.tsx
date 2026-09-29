import type { Metadata } from 'next';
import { isSignedIn } from '@/lib/admin/session';
import LoginForm from './LoginForm';
import TokenNotice from './TokenNotice';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Website manager',
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    if (!(await isSignedIn())) return <LoginForm />;

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            <TokenNotice />
            {children}
        </div>
    );
}
