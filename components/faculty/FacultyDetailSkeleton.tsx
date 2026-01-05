import { Skeleton } from "@/components/ui/skeleton"
import Container from "@/components/custom/Container"
import StarSpinner from "@/components/ui/StarSpinner"

export const FacultyDetailSkeleton = () => {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 z-50 flex items-center justify-center sticky top-0 h-screen">
                <StarSpinner />
            </div>
            <div className="opacity-50 pointer-events-none">
                <Container size='xl'>
                    <div className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        <div className='flex flex-col gap-8'>
                            <div className='flex items-center gap-3'>
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="w-4 h-4 rounded-full" />
                            </div>

                            <Skeleton className="h-12 w-3/4 md:w-1/2" />
                            <Skeleton className="h-2 w-20 rounded-full" />

                            <div className='space-y-6'>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>

                            <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                <Skeleton className="h-14 w-48 rounded-full" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-32 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
