'use client';
import React, { useEffect, useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import Container from '@/components/custom/Container';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { ClubItems, useClubs } from '@/hooks/useClubs';
import ClubCardSkeleton from '@/components/clubs/ClubCardSkeleton';
import academicIcon from '@/public/images/academic.svg'
import creativeIcon from '@/public/images/social.svg'
import leadershipIcon from '@/public/images/leadership&S.svg'
import techIcon from '@/public/images/tech.svg'
import activityIcon from '@/public/images/activity.svg'
import FetchError from '@/components/custom/FetchError';
import NoData from '@/components/custom/NoData';


const page = () => {
    const [currentId, setCurrentId] = useState<number>(0)
    const { data: clubs, isLoading, error } = useClubs();
    const [search, setSearch] = useState<string>('');

    const navItems = [
        { name: 'All Clubs', value: 'all' },
        { name: 'Tech Clubs', value: 'Tech Clubs' },
        { name: 'Creative & Arts', value: 'Creative & Arts' },
        { name: 'Leadership & Service', value: 'Leadership & Service' },
        { name: 'Sport & Fitness', value: 'Sport & Fitness' },
        { name: 'Academic Societies', value: 'Academic Societies' },
    ]

    const [filteredClubs, setFilteredClubs] = useState<ClubItems[]>(clubs || []);
    useEffect(() => {
        setFilteredClubs(clubs || []);
    }, [clubs])

    useEffect(() => {
        if (currentId === 0) {
            setFilteredClubs(clubs || []);
            return;
        }
        const filteredClubs = clubs?.filter((club) => club.clubType === navItems[currentId].value) || [];
        setFilteredClubs(filteredClubs);
    }, [currentId, clubs])

    useEffect(() => {
        const filteredClubs = clubs?.filter((club) => club.clubName.toLowerCase().includes(search.toLowerCase())) || [];
        setFilteredClubs(filteredClubs);
    }, [search, clubs])

    const getClubIcon = (type: string) => {
        switch (type) {
            case 'Tech Clubs':
                return techIcon;
            case 'Creative & Arts':
                return creativeIcon;
            case 'Leadership & Service':
                return leadershipIcon;
            case 'Sport & Fitness':
                return activityIcon;
            case 'Academic Societies':
                return academicIcon;
            default:
                return activityIcon;
        }
    }

    if (error) {
        return <FetchError />
    }

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ul className='flex gap-2 flex-wrap justify-center'>
                        {navItems.map((item, index) => (
                            <li onClick={() => setCurrentId(index)} key={index} className={`rounded-full ${currentId === index ? 'bg-primary text-white' : 'bg-slate-100'}  text-black font-medium px-6 py-2 cursor-pointer transition-all duration-300 text-sm`}>{item.name}</li>
                        ))}
                    </ul>
                </div>

            </Container>
            <Container size="xl">
                <div className='py-4'>
                    <h1 className='font-bold text-3xl text-center font-header'>Featured Clubs</h1>
                    <p className='text-center mt-2'>Discover our most active and engaging student communities</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6'>
                        {isLoading ?
                            <>
                                <ClubCardSkeleton />
                                <ClubCardSkeleton />
                                <ClubCardSkeleton />
                            </>
                            : filteredClubs.filter((club) => club.isFeatured)?.map((club, index) => (
                                <div className='p-6 shadow-lg rounded-xl h-[454px] flex flex-col justify-between' key={index}>
                                    <div className='w-full h-56 bg-slate-100 rounded-xl relative overflow-hidden'>
                                        <Image src={club.clubLogo.url} alt={club.clubLogo.title || "Club Logo"} fill className='object-cover rounded-xl' />
                                    </div>
                                    <div className='flex flex-col gap-y-4 py-4'>
                                        <h2 className='font-bold text-lg font-header'>{club.clubName}</h2>
                                        <p className='text-sm text-gray-500'>{club.description.slice(0, 250) + '...'}</p>
                                        <a href={club.clubLink} target="_blank" rel="noopener noreferrer" className='bg-primary cursor-pointer hover:bg-slate-800 text-white px-4 py-2 rounded-full w-full font-medium transition-all duration-300 hover:scale-105 text-center block'>
                                            Join Club
                                        </a>
                                    </div>
                                </div>
                            ))}
                        {error && <p className='text-red-500'>Error fetching clubs</p>}
                    </div>
                    {filteredClubs?.length === 0 && <NoData title='No clubs found' description='There are no clubs to display at this time.' />}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 py-12 mt-20'>
                        {filteredClubs?.filter(club => !club.isFeatured).map((club, index) => (
                            <div key={index} className='bg-[#F9FAFB] p-6 rounded-xl flex flex-col gap-4 w-full'>
                                <div className='w-12 h-12 rounded-full bg-primary/13 p-1 flex items-center justify-center'>
                                    <Image src={getClubIcon(club.clubType)} alt="" width={32} height={32} />
                                </div>
                                <h2 className='font-bold text-lg font-header'>{club.clubName}</h2>
                                <p className='text-sm text-gray-500'>{club.description.slice(0, 250) + '...'}</p>
                                <div className='flex items-center gap-2'>
                                    <span className='font-medium text-xs text-primary bg-primary/23 px-2 py-1 rounded-full'>{club.clubType}</span>
                                </div>
                                <div className='w-full'>
                                    <a
                                        href={club.clubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='bg-black cursor-pointer text-white px-4 py-2 rounded-full w-full font-medium hover:bg-primary/80 transition-all duration-300 hover:scale-105 block text-center'>
                                        Join Club
                                    </a>
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