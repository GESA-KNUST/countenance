'use client'
import Container from '@/components/custom/Container'
import HeroSection from '@/components/home/HeroSection'
import OpportunityCard from '@/components/hubs/OpportunityCard'
import React, { useEffect, useMemo, useState } from 'react'
import internship from '@/public/images/internship.svg'
import scholarship from '@/public/images/scholarship.svg'
import financialAid from '@/public/images/financial-aid.svg'
import Image from 'next/image'
import announcement from '@/public/images/announcement.svg'
import tips from '@/public/images/tips.svg'
import correctBullet from '@/public/images/corectBullet.svg'
import { useHubs } from '@/hooks/useHubs'
import SkeletonLoading from '@/components/hubs/SkeletonLoading'
import POLoading from '@/components/hubs/POLoading'
import { useAnnouncements } from '@/hooks/useAnnoucement'

const page = () => {
    const [currentId, setCurrentId] = useState<number>(0)
    const { data: hubs, isLoading, error } = useHubs()
    const {
        data: announcementsData,
        isLoading: loadingAnnouncements,
        error: announcementError
    } = useAnnouncements()

    const announcements = useMemo(() => {
        if (!announcementsData) return [];
        return [...announcementsData]
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
            .slice(0, 3);
    }, [announcementsData]);


    const navItems = [
        { name: 'All', value: 'all', icon: null },
        { name: 'Internships', value: 'internship', icon: internship },
        { name: 'Scholarships', value: 'scholarship', icon: scholarship },
        { name: 'Financial Aid', value: 'financial aid', icon: financialAid },
    ]

    const [filteredOpportunities, setFilteredOpportunities] = useState(hubs)
    useEffect(() => {
        setFilteredOpportunities(hubs)
    }, [hubs])
    useEffect(() => {
        if (currentId === 0) {
            setFilteredOpportunities(hubs)
        } else {
            const filtered = hubs.filter(opportunity => opportunity.opportunityType.toLowerCase() === navItems[currentId].value)
            setFilteredOpportunities(filtered)
        }
    }, [currentId])

    const renderBorderColor = (index: number) => {
        switch (index) {
            case 0:
                return "bg-primary"
            case 1:
                return "bg-[#B1B1B1]/50"
            case 2:
                return "bg-black"
            default:
                return "bg-black"
        }
    }

    const applicationTips = [
        { description: "Start applications early to avoid last-minute rush." },
        { description: "Tailor your resume for each opportunity." },
        { description: "Follow up after submitting applications." },
    ]




    return (
        <div className='font-poppins min-h-screen'>
            <HeroSection
                title="Explore New Opportunities"
                highlight="Opportunities"
                text='Discover upcoming opportunities—from internships to scholarships and financial support—carefully curated to help you grow and succeed.'
                images={['/images/img1.png', '/images/img2.png']}
            />
            <Container size='lg'>
                <div className='flex items-center justify-center w-full'>
                    <ul className='flex flex-wrap justify-center items-center gap-2 sm:gap-4 bg-slate-100 rounded-xl p-1.5 sm:p-2 w-full sm:w-auto'>
                        {navItems.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => setCurrentId(index)}
                                className={`rounded-lg flex items-center justify-center gap-2 ${currentId === index ? 'bg-white text-black shadow-sm' : 'hover:bg-slate-200/50'} text-black font-medium px-3 sm:px-6 py-2 cursor-pointer transition-all duration-300 text-xs sm:text-sm flex-auto sm:flex-none whitespace-nowrap`}>
                                {item.icon && <Image src={item.icon} alt="" width={14} height={14} className="w-3 h-3 sm:w-auto sm:h-auto" />}
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
            <Container size='xl'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 content-start">
                        {isLoading ? (
                            <>
                                <SkeletonLoading />
                                <SkeletonLoading />
                                <SkeletonLoading />
                            </>
                        ) : (
                            <>
                                {filteredOpportunities?.map((opp, index) => (
                                    <OpportunityCard
                                        key={`${index}`}
                                        {...opp}
                                    />
                                ))}
                            </>
                        )}
                        {error && <p className='text-red-500 text-sm'>Error loading opportunities</p>}
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        {
                            loadingAnnouncements ? (
                                <>
                                    <POLoading />
                                    <POLoading />
                                    <POLoading />
                                </>
                            ) : (
                                <div className='flex flex-col gap-2 shadow-md rounded-xl p-2 px-4'>
                                    <div className='flex items-center gap-4'>
                                        <Image src={announcement} alt="" />
                                        <p className='text-[#111827] font-medium text-lg'>Latest Announcements</p>
                                    </div>
                                    <div className='flex flex-col gap-2 py-2'>
                                        {announcements?.map((announcement, index) => (
                                            <a href={announcement.actionLink} target="_blank" rel="noopener noreferrer" className='flex gap-4 hover:bg-slate-200/20 py-2 rounded-xl transition-all duration-300' key={index}>
                                                <div className={`${renderBorderColor(index)} h-16 w-1.5`}></div>
                                                <div className='flex flex-col gap-2'>
                                                    <p className='font-medium'>{announcement.title}</p>
                                                    <p className='text-gray-600 text-sm'>{announcement.description.slice(0, 50) + '...'}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        {
                            isLoading ? (
                                <>
                                    <POLoading />
                                    <POLoading />
                                    <POLoading />
                                </>
                            ) : (
                                <div className='flex flex-col gap-4 shadow-md rounded-xl p-2 px-4'>
                                    <h1 className='font-semibold text-lg'>Popular Opportunities</h1>
                                    <div className='flex flex-col gap-2 py-2'>
                                        {hubs?.map((opp, index) => (
                                            <a href={opp.source} target='_blank' className='flex gap-2 cursor-pointer hover:bg-slate-200/20 p-2 rounded-xl' key={index}>
                                                <div className='flex flex-col gap-2'>
                                                    <p className='font-medium'>{opp.title}</p>
                                                    <p className='text-gray-600 text-sm'>{opp.description.slice(0, 50) + '...'}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        <div className='flex flex-col gap-4 shadow-md rounded-xl py-4 px-4 bg-black'>
                            <h1 className='flex items-center gap-2 font-semibold text-lg xl:text-xl text-primary'>
                                <Image src={tips} alt="" />
                                Application Tips
                            </h1>
                            <div className='flex flex-col gap-2 py-2 text-white'>
                                {applicationTips.map((tip, index) => (
                                    <div className='flex gap-2 items-center' key={index}>
                                        <Image src={correctBullet} alt="" />
                                        <div className='flex flex-col gap-2'>
                                            <p className='text-xs sm:text-sm xl:text-base'>{tip.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default page