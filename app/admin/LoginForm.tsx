'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StarSpinner from '@/components/ui/StarSpinner';

const SIGN_IN_ERRORS: Record<string, string> = {
    access: 'That Google account does not have access to this dashboard. Ask whoever runs the website to invite you.',
    mismatch: 'That invite was sent to a different email address. Sign in with the account it was sent to.',
    invite: 'That invite link has already been used or has expired. Ask for a new one.',
    signin: 'Google sign-in did not finish. Please try again.',
    setup: 'Google sign-in is not set up yet. Ask a developer.',
    busy: 'Too many attempts. Please wait a few minutes and try again.',
};

const LoginForm = ({ inviteToken }: { inviteToken?: string }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const router = useRouter();
    const params = useSearchParams();

    const signInError = SIGN_IN_ERRORS[params.get('error') ?? ''] ?? '';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.message ?? 'That password is not right.');
                setBusy(false);
                return;
            }

            router.refresh();
        } catch {
            setError('No internet connection. Try again.');
            setBusy(false);
        }
    };

    const googleHref = inviteToken
        ? `/api/admin/auth/start?invite=${encodeURIComponent(inviteToken)}`
        : '/api/admin/auth/start';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 font-poppins">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold font-header mb-1">Website manager</h1>
                <p className="text-sm text-gray-500 mb-6">
                    {inviteToken
                        ? 'You have been invited to help manage the GESA website. Sign in with the Google account the invite was sent to.'
                        : 'Sign in to manage the GESA website.'}
                </p>

                {signInError && (
                    <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {signInError}
                    </p>
                )}

                <a
                    href={googleHref}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-black"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                        <path
                            fill="#4285F4"
                            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.6-5.2 3.6-8.8z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8h-4v3.1A12 12 0 0 0 12 24z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.3 14.3a7.1 7.1 0 0 1 0-4.6v-3.1h-4a12 12 0 0 0 0 10.8l4-3.1z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z"
                        />
                    </svg>
                    Continue with Google
                </a>

                {!inviteToken && (
                    <div className="mt-6 border-t border-gray-100 pt-5">
                        {!showPassword ? (
                            <button
                                type="button"
                                onClick={() => setShowPassword(true)}
                                className="text-sm text-gray-500 underline underline-offset-4 hover:text-black cursor-pointer"
                            >
                                Owner sign-in
                            </button>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Owner password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoFocus
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-black"
                                />

                                {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={busy || password.length === 0}
                                    className="mt-4 w-full bg-primary text-black font-semibold rounded-lg py-3 disabled:opacity-40 transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center"
                                >
                                    {busy ? <StarSpinner /> : 'Continue'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
