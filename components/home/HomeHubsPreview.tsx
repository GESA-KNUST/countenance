'use client'
import React from 'react'
import Container from '../custom/Container'
import OpportunityCard from '../hubs/OpportunityCard'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useHubs } from '@/hooks/useHubs'

const HomeHubsPreview = () => {
    const { data: hubs, isLoading } = useHubs()

    if (isLoading) {
        return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading hubs...</div>
    }

    return (
        <div className="bg-white py-12 font-poppins">
            <Container size='xl'>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h2 className="md:text-3xl text-2xl font-header font-bold text-gray-900">Latest Opportunities</h2>
                            <p className="text-gray-500 text-xs md:text-base">Discover internships, scholarships, and more.</p>
                        </div>
                        <Link href="/hubs">
                            <Button variant="ghost" className="text-sm md:text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                                View All <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hubs?.slice(0, 3)?.map((hub, index) => (
                            <OpportunityCard
                                key={index}
                                {...hub}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeHubsPreview
