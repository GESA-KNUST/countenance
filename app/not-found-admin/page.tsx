import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: false },
};

const NotFoundAdmin = () => {
    return (
        <div className="font-poppins min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <p className="font-header text-6xl font-bold text-[#252638]">404</p>
                <h1 className="font-header text-2xl font-bold text-[#252638] mt-4">
                    This page could not be found
                </h1>
                <p className="text-gray-600 mt-2">
                    The page you are looking for does not exist on this site.
                </p>
                <Link
                    href="/"
                    className="inline-block mt-6 rounded-lg bg-[#FFBE00] px-6 py-3 text-sm font-bold text-black"
                >
                    Go to the homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundAdmin;
