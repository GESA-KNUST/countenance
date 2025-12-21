import React from 'react'
import Container from '../custom/Container'
import { Skeleton } from '../ui/skeleton'

const LoadingPOTW = () => {
    return (
        <Container size='xl'>
            <div className='my-16 flex flex-col lg:flex-row items-center gap-10 justify-center'>

                <div className='w-full md:w-[480px] lg:w-[520px] sm:h-[450px] h-[350px] overflow-hidden relative rounded-2xl'>
                    <Skeleton className="w-full h-full" />
                </div>

                <div className='flex flex-col gap-4 xl:max-w-xl lg:w-1/2 w-full'>
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                </div>

            </div>
        </Container>


    )
}

export default LoadingPOTW