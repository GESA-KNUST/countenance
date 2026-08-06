import StarSpinner from '@/components/ui/StarSpinner';

interface PageLoaderProps {
    className?: string;
}

const PageLoader = ({ className = 'min-h-screen' }: PageLoaderProps) => (
    <div className={`${className} flex items-center justify-center bg-gray-50`}>
        <StarSpinner />
    </div>
);

export default PageLoader;
