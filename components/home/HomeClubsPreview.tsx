'use client'
import React from 'react'
import Container from '../custom/Container'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const HomeClubsPreview = () => {
    return (
        <div className="bg-slate-50 py-12 font-poppins">
            <Container size='xl'>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Clubs</h2>
                            <p className="text-xs md:text-base text-gray-500">Connect with communities that match your passions.</p>
                        </div>
                        <Link href="/clubs">
                            <Button variant="ghost" className="text-sm md:text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                                View All Clubs <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'GESA Coding Society', tag: 'Tech', desc: 'Discover hands-on coding workshops and build amazing projects.' },
                            { name: 'AI & Machine Learning', tag: 'Machine Learning', desc: 'Explore artificial intelligence and build intelligent systems.' },
                            { name: 'Robotics Club', tag: 'Robotics', desc: 'Design, build and program robots for various challenges.' },
                        ].map((club, index) => (
                            <div key={index} className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group'>
                                <div className='w-14 h-14 rounded-xl bg-primary/10 p-3 flex items-center justify-center group-hover:scale-110 transition-transform'>
                                    {/* Placeholder Icon */}
                                    <div className="w-full h-full bg-primary/20 rounded-lg"></div>
                                </div>
                                <div>
                                    <h3 className='font-bold text-xl mb-2 group-hover:text-primary transition-colors'>{club.name}</h3>
                                    <p className='text-sm text-gray-500 mb-4 line-clamp-2'>{club.desc}</p>
                                    <span className='font-medium text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full'>
                                        {club.tag}
                                    </span>
                                </div>

                                <button className='mt-auto w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold hover:bg-primary hover:text-black hover:border-primary transition-all duration-300'>
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HomeClubsPreview
