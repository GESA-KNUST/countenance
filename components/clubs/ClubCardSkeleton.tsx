import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ClubCardSkeleton = () => {
    return (
        <div className='p-6 shadow-lg rounded-xl h-[454px] flex flex-col justify-between'>
            <div className='w-full h-56 bg-slate-100 rounded-xl relative overflow-hidden'>
                <Skeleton className='w-full h-full' />
            </div>
            <div className='flex flex-col gap-y-4 py-4'>
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4' />
                <div className='bg-primary cursor-pointer px-4 py-2 rounded-full w-full font-medium hover:bg-primary/80 transition-all duration-300 hover:scale-105 text-center'>
                    <Skeleton className='w-full h-4' />
                </div>
            </div>
        </div>
    )
}

export default ClubCardSkeleton