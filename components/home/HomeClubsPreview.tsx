'use client'
import React from 'react'
import Container from '../custom/Container'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useClubs } from '@/hooks/useClubs'
import Image from 'next/image'
import FetchError from '../custom/FetchError'
import NoData from '../custom/NoData'

const HomeClubsPreview = () => {
    const { data: clubs, isLoading, error } = useClubs()

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading clubs...</div>
    }

    if (error) {
        return <FetchError />
    }

    if(clubs?.length == 0) {
        return <NoData title='No clubs found' />
    }

    return (
        <div className="bg-slate-50 py-12 font-poppins relative">
            <Container size='xl' className='relative z-30'>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900 font-header">Featured Clubs</h2>
                            <p className="text-xs md:text-base text-gray-500">Connect with communities that match your passions.</p>
                        </div>
                        <Link href="/clubs">
                            <Button variant="ghost" className="text-sm md:text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                                View All Clubs <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs?.filter(club => club.isFeatured).slice(0, 3)?.map((club, index) => (
                            <div key={index} className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group'>
                                <div className='w-14 h-14 bg-primary/10 p-3 flex items-center justify-center group-hover:scale-110 transition-transform relative'>
                                    {/* Placeholder Icon */}
                                    {/* <div className="w-full h-full bg-primary/20 rounded-lg"></div> */}
                                    <Image 
                                        src={club?.clubLogo.url || null} 
                                        alt="" 
                                        className="w-14 h-14 object-cover rounded-md" 
                                        fill
                                    />
                                </div>
                                <div>
                                    <h3 className='font-bold text-xl mb-2 transition-colors group-hover:text-blue-600 font-header'>{club.clubName}</h3>
                                    <p className='text-sm text-gray-500 mb-4 line-clamp-2'>{club.description}</p>
                                    <span className='font-medium text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full'>
                                        {club.clubType}
                                    </span>
                                </div>

                                <a href={club.clubLink} target="_blank" rel="noopener noreferrer" className='font-medium inline-flex justify-center items-center w-full bg-primary mt-3 border border-slate-200 hover:bg-slate-800 hover:text-white transition-all rounded-xl py-3 group-hover:shadow-lg z-10 cursor-pointer'>
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeClubsPreview
