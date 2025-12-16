'use client';
import React, { useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import Container from '@/components/custom/Container';
import { Search } from 'lucide-react';
import Image from 'next/image';

const page = () => {
    const [currentId, setCurrentId] = useState<number>(0)


    return (
        <div className='font-poppins min-h-screen'>
            <HeroSection
                title="Explore Our Clubs"
                highlight="Clubs"
                text='Connect, learn, and grow with clubs that support your passions, goals, and personal development.'
                images={['/images/img1.png', '/images/img2.png']}
                button={false}
            />
            <Container size="lg">
                <div className='flex flex-col items-center justify-center gap-6'>
                    <div className='w-full border border-gray-300 h-16 rounded-xl flex items-center px-4'>
                        <Search className='text-gray-300' />
                        <input
                            type="text"
                            placeholder='Search clubs'
                            className='w-full p-2 rounded-xl h-full outline-0'
                        />
                    </div>
                    <ul className='flex gap-2 flex-wrap justify-center'>
                        {[
                            { name: 'All Clubs', value: 'all' },
                            { name: 'Tech Clubs', value: 'all' },
                            { name: 'Creative & Arts', value: 'all' },
                            { name: 'Leadership & Service', value: 'all' },
                            { name: 'Sport & Fitness', value: 'all' },
                            { name: 'Academic Societies', value: 'all' },
                        ].map((item, index) => (
                            <li onClick={() => setCurrentId(index)} key={index} className={`rounded-full ${currentId === index ? 'bg-primary text-white' : 'bg-slate-100'}  text-black font-medium px-6 py-2 cursor-pointer transition-all duration-300 text-sm`}>{item.name}</li>
                        ))}
                    </ul>
                </div>

            </Container>
            <Container size="xl">
                <div className='py-4'>
                    <h1 className='font-bold text-3xl text-center'>Featured Clubs</h1>
                    <p className='text-center mt-2'>Discover our most active and engaging student communities</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div className='p-6 shadow-lg rounded-xl h-[454px] flex flex-col justify-between' key={index}>
                                <div className='w-full h-56 bg-slate-100 rounded-xl'></div>
                                <div className='flex flex-col gap-y-4'>
                                    <h2 className='font-bold text-lg'>GESA Coding Society</h2>
                                    <p className='text-sm text-gray-500'>Discover hands-on coding workshops and build amazing projects with developers</p>
                                    <div className='w-full'>
                                        <button className='bg-primary cursor-pointer px-4 py-2 rounded-full w-full font-medium hover:bg-primary/80 transition-all duration-300 hover:scale-105'>Join Club</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12 mt-20'>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className='bg-[#F9FAFB] p-6 rounded-xl flex flex-col gap-4 w-[384px]'>
                                <div className='w-12 h-12 rounded-full bg-primary/13 p-1 flex items-center justify-center'>
                                    <Image src="/images/tech.svg" alt="" width={32} height={32} />
                                </div>
                                <h2 className='font-bold text-lg'>AI & Machine Learning</h2>
                                <p className='text-sm text-gray-500'>Explore artificial intelligence and build intelligent</p>
                                <div className='flex items-center gap-2'>
                                    <span className='font-medium text-xs text-primary bg-primary/23 px-2 py-1 rounded-full'>Tech</span>
                                    <span className='font-medium text-xs text bg-primary/23 px-2 py-1 rounded-full'>Research</span>
                                </div>
                                <div className='w-full'>
                                    <button
                                        className='bg-black cursor-pointer text-white px-4 py-2 rounded-full w-full font-medium hover:bg-primary/80 transition-all duration-300 hover:scale-105'>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default page;