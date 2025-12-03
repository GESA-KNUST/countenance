'use client';

import { Skeleton } from '@/components/ui/skeleton';

const SkeletonLoading = () => {
  return (
    <div className="w-full lg:w-2/3">
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-8" />
      <Skeleton className="w-full h-[574px] mb-8" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-4/5 mb-4" />
    </div>
  );
};

export default SkeletonLoading;
