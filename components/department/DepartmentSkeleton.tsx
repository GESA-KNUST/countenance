import { Skeleton } from "@/components/ui/skeleton"
import StarSpinner from "@/components/ui/StarSpinner"

export const DepartmentSkeleton = () => {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] flex flex-col gap-6 w-full border border-gray-100 shadow-sm opacity-50">
            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="h-8 w-3/4" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="w-full pt-4 mt-auto">
                <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
        </div>
    )
}

export const DepartmentGridSkeleton = () => {
    return (
        <div className="relative min-h-[50vh]">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <StarSpinner />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <DepartmentSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
