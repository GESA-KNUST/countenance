'use client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-gray-500 underline hover:text-black cursor-pointer shrink-0"
        >
            Sign out
        </button>
    );
};

export default LogoutButton;
