import { AlertTriangle } from 'lucide-react';
import { tokenHealth } from '@/lib/admin/token-health';

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const TokenNotice = async () => {
    const health = await tokenHealth();

    if (health.state === 'ok' || health.state === 'unknown') return null;

    const expired = health.state === 'expired';

    return (
        <div className="max-w-2xl mx-auto px-4 pt-6">
            <div
                className={`rounded-xl border p-4 flex gap-3 ${
                    expired ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
                }`}
            >
                <AlertTriangle
                    className={`h-5 w-5 shrink-0 mt-0.5 ${
                        expired ? 'text-red-600' : 'text-amber-600'
                    }`}
                />
                <div className="text-sm">
                    <p className={`font-semibold ${expired ? 'text-red-900' : 'text-amber-900'}`}>
                        {expired
                            ? 'This dashboard needs a new Contentful key'
                            : `This dashboard's Contentful key expires in ${health.daysLeft} day${
                                  health.daysLeft === 1 ? '' : 's'
                              }`}
                    </p>
                    <p className={`mt-1 ${expired ? 'text-red-800' : 'text-amber-800'}`}>
                        {expired
                            ? 'Saving changes will fail until it is replaced.'
                            : `It stops working on ${formatDate(health.expiresAt)}, and saving changes will fail after that.`}{' '}
                        The public website is not affected and stays online either way.
                    </p>
                    <p className={`mt-2 ${expired ? 'text-red-800' : 'text-amber-800'}`}>
                        Send this message to whoever looks after the website. The steps are in the
                        project under <code className="font-mono">docs/renew-contentful-token.md</code>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TokenNotice;
