import NotFoundCard from '@/components/common/NotFoundCard';
import { Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <NotFoundCard
            icon={Compass}
            title="Page Not Found"
            message="The page you're looking for might have been moved, renamed, or never existed."
            backHref="/"
            backText="Back to Home"
        />
    );
}
