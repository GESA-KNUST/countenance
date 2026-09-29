import { Suspense } from 'react';
import { currentManager } from '@/lib/admin/session';
import { inviteForToken } from '@/lib/admin/managers';
import LoginForm from '../../LoginForm';

export const dynamic = 'force-dynamic';

const InvitePage = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params;
    const invite = await inviteForToken(token);
    const signedIn = await currentManager();

    if (!invite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-poppins">
                <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold font-header">This invite has expired</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Invite links work once and stop working after 7 days. Ask whoever runs the
                        website to send you a new one.
                    </p>
                </div>
            </div>
        );
    }

    if (signedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-poppins">
                <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-xl font-bold font-header">You are already signed in</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign out first if you want to accept this invite with another account.
                    </p>
                    <a
                        href="/admin"
                        className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#FFBE00] px-6 py-3 text-sm font-bold text-black"
                    >
                        Go to the dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <Suspense>
            <LoginForm inviteToken={token} />
        </Suspense>
    );
};

export default InvitePage;
