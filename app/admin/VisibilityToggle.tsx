'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const VisibilityToggle = ({ id, published }: { id: string; published: boolean }) => {
    const [busy, setBusy] = useState(false);
    const router = useRouter();

    const toggle = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setBusy(true);

        await fetch('/api/admin/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, published: !published }),
        });

        setBusy(false);
        router.refresh();
    };

    return (
        <button
            onClick={toggle}
            disabled={busy}
            title={published ? 'Hide from the website' : 'Show on the website'}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer disabled:opacity-40 shrink-0"
        >
            {published ? (
                <Eye className="w-4 h-4 text-gray-600" />
            ) : (
                <EyeOff className="w-4 h-4 text-amber-600" />
            )}
        </button>
    );
};

export default VisibilityToggle;
