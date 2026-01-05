'use client'
import React from 'react'
import Container from '../custom/Container'
import OpportunityCard from '../hubs/OpportunityCard'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useHubs } from '@/hooks/useHubs'
import Image from 'next/image'
import FetchError from '../custom/FetchError'
import NoData from '../custom/NoData'

import { motion } from 'framer-motion'

const HomeHubsPreview = () => {
    const { data: hubs, isLoading, error } = useHubs()

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading hubs...</div>
    }

    if (error) {
        return <FetchError />
    }

    if (hubs?.length == 0) {
        return <NoData title='No hubs found' />
    }

    return (
        <div className="bg-white py-12 font-poppins relative overflow-hidden">
            <Image
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/images/img1.png"
                alt="Hub Preview"
                fill
                priority
                sizes="100vw"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />
            <Container size='xl' className='relative z-30'>
                <div className="flex flex-col gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex justify-between items-center"
                    >
                        <div className="space-y-1">
                            <h2 className="md:text-3xl text-2xl font-header font-bold text-white">Latest Opportunities</h2>
                            <p className="text-xs md:text-base text-white">Discover internships, scholarships, and more.</p>
                        </div>
                        <Link href="/hubs">
                            <Button variant="ghost" className="text-sm md:text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/40 cursor-pointer">
                                View All <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hubs?.slice(0, 3)?.map((hub, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <OpportunityCard {...hub} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeHubsPreview
