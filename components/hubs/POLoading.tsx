import React from 'react'
import { Skeleton } from '../ui/skeleton'

const POLoading = () => {
    return (
        <div className='flex gap-2 cursor-pointer hover:bg-slate-200/20 p-2 rounded-xl'>
            <div className='flex flex-col gap-2 w-full'>
                <div className='font-medium'><Skeleton className="w-full h-4" /></div>
                <div className='text-gray-600 text-sm'><Skeleton className="w-full h-4" /></div>
                <div className='text-gray-600 text-sm'><Skeleton className="w-1/2 h-4" /></div>
            </div>
        </div>
    )
}

export default POLoading