'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarSpinner from '@/components/ui/StarSpinner';

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const router = useRouter();

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-poppins">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
                <h1 className="text-2xl font-bold font-header mb-1">Website manager</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Enter the password to manage the GESA website.
                </p>

                <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
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
                    className="mt-6 w-full bg-primary text-black font-semibold rounded-lg py-3 disabled:opacity-40 hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center"
                >
                    {busy ? <StarSpinner /> : 'Continue'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
