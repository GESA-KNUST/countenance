import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireManager } from '@/lib/admin/session';
import { allManagers } from '@/lib/admin/managers';
import ManagerList from './ManagerList';

export const dynamic = 'force-dynamic';

const ManagersPage = async () => {
    const owner = await requireManager('owner');
    if (!owner) notFound();

    const managers = await allManagers();

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
            <Link
                href="/admin"
                className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-black"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back
            </Link>

            <h1 className="mt-6 text-2xl md:text-3xl font-bold font-header">Who can make changes</h1>
            <p className="text-gray-600 text-sm mt-1 mb-8">
                Invite people with their Gmail. They sign in with Google, so there is no password to
                share. You can remove anyone at any time.
            </p>

            <ManagerList managers={managers} currentId={owner.id} />
        </div>
    );
};

export default ManagersPage;
