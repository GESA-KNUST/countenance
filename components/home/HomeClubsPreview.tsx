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

import { motion } from "framer-motion";

const HomeClubsPreview = () => {
    const { data: clubs, isLoading, error } = useClubs()

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading clubs...</div>
    }

    if (error) {
        return <FetchError />
    }

    if (clubs?.length == 0) {
        return <NoData title='No clubs found' />
    }

    return (
        <div className="bg-slate-50 py-16 font-poppins relative overflow-hidden">
            <Container size='xl' className='relative z-30'>
                <div className="flex flex-col gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex justify-between items-center"
                    >
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold text-gray-900 font-header">Featured Clubs</h2>
                            <p className="text-sm md:text-lg text-gray-500 max-w-2xl">Connect with communities that match your passions and engineering interests.</p>
                        </div>
                        <Link href="/clubs" className="hidden md:block">
                            <Button variant="ghost" className="text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-300">
                                View All Clubs <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {clubs?.filter(club => club.isFeatured).slice(0, 3)?.map((club, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className='bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col gap-6 group hover:-translate-y-1'
                            >
                                <div className='w-16 h-16 bg-primary/10 rounded-2xl p-0 flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden'>
                                    <Image
                                        src={club?.clubLogo.url || null}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        fill
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className='font-bold text-2xl mb-3 transition-colors group-hover:text-primary font-header'>{club.clubName}</h3>
                                    <p className='text-gray-500 mb-6 line-clamp-2 leading-relaxed'>{club.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className='font-bold text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full'>
                                            {club.clubType}
                                        </span>
                                    </div>
                                </div>

                                <a href={club.clubLink} target="_blank" rel="noopener noreferrer" className='font-bold inline-flex justify-center items-center w-full bg-white border-2 border-slate-100 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl py-4 group-hover:shadow-md z-10 cursor-pointer'>
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeClubsPreview
