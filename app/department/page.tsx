'use client'
import Container from '@/components/custom/Container'
import HeroSection from '@/components/home/HeroSection'
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const page = () => {
    const [search, setSearch] = useState<string>('');
    return (
        <div className='font-poppins min-h-screen'>
            <HeroSection
                title="Find Your Department"
                highlight="Department"
                text='Choose from our diverse departments designed to equip you with skills, knowledge, and hands-on experience.'
                images={['/images/img1.png', '/images/img2.png']}
                button={false}
            />
            <Container size='xl'>
                <div className='flex items-center justify-center gap-6'>
                    <div className='w-[672px] border border-gray-300 h-16 rounded-xl flex items-center px-4'>
                        <Search className='text-gray-300' />
                        <input
                            type="text"
                            placeholder='Search clubs'
                            className='w-full p-2 rounded-xl h-full outline-0'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ul className='flex gap-2 flex-wrap justify-center'>
                        <li className='bg-primary text-white px-6 py-3 font-header font-semibold rounded-full cursor-pointer'>All Departments</li>
                    </ul>
                </div>
            </Container>
            <Container size='xl'>
                <div className='py-2'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6'>
                        {/* Content */}
                            {Array.from({length: 6}).map((_,index) => (
                                <div key={index} className='bg-[#F9FAFB] p-6 rounded-xl flex flex-col gap-4 w-full'>
                                <div className='w-12 h-12 rounded-full bg-primary/13 p-1 flex items-center justify-center'>
                                    {/* <Image src={getClubIcon(club.clubType)} alt="" width={32} height={32} /> */}
                                </div>
                                <h2 className='font-bold text-lg font-header'>Computer & Biomedical Engineering</h2>
                                <p className='text-sm text-gray-500'>Explore the diverse academic units that drive excellence, innovation, and professional growth across our institution.</p>
                                <div className='w-full'>
                                    <button
                                        className='bg-black cursor-pointer text-white px-4 py-2 rounded-full w-full font-medium hover:bg-primary/80 transition-all duration-300 hover:scale-105'>
                                        <Link href={`/department/1`}>View Department</Link>
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

export default page