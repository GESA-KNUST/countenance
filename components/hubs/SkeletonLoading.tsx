import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonLoading = () => {
    return (
        <div className="rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden h-[300px]">
            <div className='flex items-center gap-2 justify-between w-full'>
                <Skeleton className="w-16 h-6" />
                <Skeleton className="w-6 h-6" />
            </div>

            <div className='w-full space-y-3 py-6'> 
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
            </div>

            <div className='flex items-center gap-2'>
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-4 h-4" />
            </div>
            <Skeleton className="w-full h-12 rounded-lg" />
        </div>
    )
}

export default SkeletonLoading