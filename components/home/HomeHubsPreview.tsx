'use client'
import React from 'react'
import Container from '../custom/Container'
import OpportunityCard from '../hubs/OpportunityCard'
import internship from '@/public/images/internship.svg'
import scholarship from '@/public/images/scholarship.svg'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const HomeHubsPreview = () => {
    // Top 3 opportunities for preview
    const opportunities = [
        {
            title: "Software Engineering Intern",
            type: "Internship",
            icon: internship,
            description: "Join our dynamic team building the future of AI. Work on real-world problems.",
            deadline: 'Dec 20, 2025'
        },
        {
            title: "Global Merit Scholarship",
            type: "Scholarship",
            icon: scholarship,
            description: "Full tuition coverage for outstanding students demonstrating academic excellence.",
            deadline: 'Dec 20, 2025'
        },
        {
            title: "Product Design Intern",
            type: "Internship",
            icon: internship,
            description: "Collaborate with cross-functional teams to design intuitive user experiences.",
            deadline: 'Dec 20, 2025'
        },
    ]

    return (
        <div className="bg-white py-12 font-poppins">
            <Container size='xl'>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h2 className="md:text-3xl text-2xl font-bold text-gray-900">Latest Opportunities</h2>
                            <p className="text-gray-500 text-xs md:text-base">Discover internships, scholarships, and more.</p>
                        </div>
                        <Link href="/hubs">
                            <Button variant="ghost" className="text-sm md:text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                                View All <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {opportunities.map((opp, index) => (
                            <OpportunityCard
                                key={index}
                                {...opp}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeHubsPreview
