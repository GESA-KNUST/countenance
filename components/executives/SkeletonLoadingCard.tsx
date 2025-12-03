import { Skeleton } from '../ui/skeleton';

const SkeletonLoadingCard = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <Skeleton className="h-[252px] w-full" />
      <div className="p-6">
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
};

export default SkeletonLoadingCard;
