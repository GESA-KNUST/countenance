import Link from 'next/link';
import { AlertTriangle, LucideIcon } from 'lucide-react';

interface NotFoundCardProps {
    title: string;
    message: string;
    backHref: string;
    backText: string;
    icon?: LucideIcon;
}


const NotFoundCard = ({
    title,
    message,
    backHref,
    backText,
    icon: Icon = AlertTriangle,
}: NotFoundCardProps) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon className="text-red-500 w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-4 font-header text-gray-900">{title}</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
            <Link
                href={backHref}
                className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20"
            >
                {backText}
            </Link>
        </div>
    </div>
);

export default NotFoundCard;
