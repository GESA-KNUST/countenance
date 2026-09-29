'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ShieldCheck, UserPlus } from 'lucide-react';
import StarSpinner from '@/components/ui/StarSpinner';
import type { Manager, ManagerRole } from '@/lib/admin/managers';

const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-black bg-white';

const STATUS_LABEL: Record<string, string> = {
    invited: 'Invite sent',
    active: 'Can make changes',
    revoked: 'No longer has access',
};

function formatDate(value: string | null) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ManagerList = ({ managers, currentId }: { managers: Manager[]; currentId: string }) => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<ManagerRole>('manager');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [link, setLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [working, setWorking] = useState('');

    const invite = async (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setError('');
        setLink('');

        try {
            const res = await fetch('/api/admin/managers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, role }),
            });
            const body = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(body.message ?? 'Could not send that invite.');
                return;
            }

            setLink(body.link ?? '');
            setEmail('');
            setName('');
            setRole('manager');
            router.refresh();
        } catch {
            setError('No internet connection. Try again.');
        } finally {
            setBusy(false);
        }
    };

    const remove = async (manager: Manager) => {
        const sure = window.confirm(
            `Remove ${manager.name}? They will not be able to change anything on the website.`
        );
        if (!sure) return;

        setWorking(manager.id);
        setError('');

        try {
            const res = await fetch('/api/admin/managers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: manager.id }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) setError(body.message ?? 'Could not remove that person.');
            else router.refresh();
        } catch {
            setError('No internet connection. Try again.');
        } finally {
            setWorking('');
        }
    };

    const changeRole = async (manager: Manager, nextRole: ManagerRole) => {
        setWorking(manager.id);
        setError('');

        try {
            const res = await fetch('/api/admin/managers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: manager.id, role: nextRole }),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) setError(body.message ?? 'Could not save that change.');
            else router.refresh();
        } catch {
            setError('No internet connection. Try again.');
        } finally {
            setWorking('');
        }
    };

    const copy = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setError('Could not copy. Select the link and copy it by hand.');
        }
    };

    const active = managers.filter((manager) => manager.status !== 'revoked');
    const removed = managers.filter((manager) => manager.status === 'revoked');

    return (
        <div className="space-y-10">
            <form onSubmit={invite} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="font-semibold mb-1 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite someone
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Use the Gmail address they will sign in with.
                </p>

                <div className="space-y-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Their name"
                        className={inputClass}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="their.name@gmail.com"
                        className={inputClass}
                    />
                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value as ManagerRole)}
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="manager">Can change the website</option>
                        <option value="owner">Can also invite and remove people</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={busy || !email || !name}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFBE00] px-6 py-3 text-sm font-bold text-black shadow-sm transition-all hover:bg-[#EDAF00] active:scale-[0.99] disabled:opacity-45 cursor-pointer"
                >
                    {busy ? <StarSpinner /> : 'Create invite link'}
                </button>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                {link && (
                    <div className="mt-4 rounded-xl border border-[#FFBE00] bg-[#FFBE00]/15 p-4">
                        <p className="text-sm font-semibold">Send them this link</p>
                        <p className="mt-1 text-sm text-gray-600">
                            It works once, for that email address only, and stops working after 7 days.
                        </p>
                        <p className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-mono">
                            {link}
                        </p>
                        <button
                            type="button"
                            onClick={() => copy(link)}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-black cursor-pointer"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied' : 'Copy link'}
                        </button>
                    </div>
                )}
            </form>

            <div>
                <p className="font-semibold mb-1">People with access</p>
                <p className="text-sm text-gray-500 mb-4">{active.length} in total.</p>

                <div className="space-y-2">
                    {active.map((manager) => {
                        const isYou = manager.id === currentId;
                        const lastSeen = formatDate(manager.lastSeenAt);

                        return (
                            <div
                                key={manager.id}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3.5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold flex items-center gap-2">
                                            {manager.name}
                                            {manager.role === 'owner' && (
                                                <ShieldCheck className="h-4 w-4 text-[#B88900]" />
                                            )}
                                            {isYou && (
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                                    You
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{manager.email}</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {STATUS_LABEL[manager.status]}
                                            {manager.role === 'owner' && ' · can invite people'}
                                            {lastSeen && ` · last here ${lastSeen}`}
                                        </p>
                                    </div>

                                    {!isYou && (
                                        <button
                                            type="button"
                                            onClick={() => remove(manager)}
                                            disabled={working === manager.id}
                                            className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:border-red-400 disabled:opacity-45 cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {!isYou && manager.status === 'active' && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeRole(
                                                manager,
                                                manager.role === 'owner' ? 'manager' : 'owner'
                                            )
                                        }
                                        disabled={working === manager.id}
                                        className="mt-3 text-xs font-semibold text-gray-500 underline underline-offset-4 hover:text-black disabled:opacity-45 cursor-pointer"
                                    >
                                        {manager.role === 'owner'
                                            ? 'Stop them inviting people'
                                            : 'Let them invite people too'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {removed.length > 0 && (
                <div>
                    <p className="font-semibold mb-1">Removed</p>
                    <p className="text-sm text-gray-500 mb-4">
                        They cannot sign in. Invite them again to give access back.
                    </p>

                    <div className="space-y-2">
                        {removed.map((manager) => (
                            <div
                                key={manager.id}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5"
                            >
                                <p className="font-semibold text-gray-600">{manager.name}</p>
                                <p className="text-sm text-gray-500 truncate">{manager.email}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerList;
