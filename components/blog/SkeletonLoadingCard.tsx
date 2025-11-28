import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonLoadingCard = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 my-10 gap-x-20 gap-y-10">
      <LoadingComponent />
      <LoadingComponent />
      <LoadingComponent />
      <LoadingComponent />
    </div>
  );
};

export default SkeletonLoadingCard;

const LoadingComponent = () => {
  return (
    <div className="h-[580px] xl:w-[334px] lg:w-[300px] sm:w-[340px] w-full shadow-lg p-5 flex justify-center rounded cursor-pointer transition-transform duration-300">
      <div className="flex flex-col gap-5 w-full">
        <div className="h-60 w-full relative">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        <Skeleton className="h-4 w-20 bg-primary/30" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />

        <div className="flex gap-2 items-center mt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};
