'use client'

import Container from '@/components/custom/Container'
import DepartmentHero from '@/components/department/DepartmentHero'
import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import star from '@/public/images/star.svg'
import Image from 'next/image'
import { Mail, Globe, Music2 } from 'lucide-react'
import Link from 'next/link'
import whatsapp2 from '@/public/images/whatsapp2.svg'
import twitter from '@/public/images/twitter.svg'
import linkedin2 from '@/public/images/linkedin2.svg'
import { useSearchParams } from 'next/navigation'
import { useDepartment } from '@/hooks/useDepartment'
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { useStore } from '@/store/useStore'
import { DepartmentDetailSkeleton } from '@/components/department/DepartmentDetailSkeleton'

const DepartmentContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { data: department, isLoading, error } = useDepartment(id as string);
    const { addToRecentlyViewed } = useStore();

    useEffect(() => {
        if (department && id) {
            addToRecentlyViewed(`/department-detail?id=${id}`);
        }
    }, [department, id, addToRecentlyViewed]);

    const options: Options = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                const assetId = node.data.target.sys.id;
                const asset = department?.about?.links?.assets?.block?.find((a: any) => a.sys.id === assetId);

                if (!asset) return null;

                return (
                    <div className="my-8 w-full rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={asset.url}
                            alt={asset.title || "Embedded Asset"}
                            width={asset.width || 800}
                            height={asset.height || 600}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                );
            },
        },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <DepartmentDetailSkeleton />
            </div>
        );
    }

    if (error || !department || !id) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="text-red-500 w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 font-header text-gray-900">Department Not Found</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">We couldn't load the details for this department. It might have been moved or doesn't exist.</p>
                    <Link href="/department" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20">
                        Back to Departments
                    </Link>
                </div>
            </div>
        );
    }

    const SocialLinks = () => (
        <div className='flex items-center gap-4 mt-2'>
            <div className='flex items-center gap-5 bg-gray-100/50 p-2.5 px-6 rounded-full border border-gray-200 shadow-sm'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mr-2'>Connect</p>
                {department.whatsappLink && (
                    <a href={department.whatsappLink} target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition-all flex items-center justify-center' title="WhatsApp">
                        <Image src={whatsapp2} alt="WhatsApp" width={28} height={28} className="w-7 h-7" />
                    </a>
                )}
                {department.xComLink && (
                    <a href={department.xComLink} target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition-all flex items-center justify-center' title="X (Twitter)">
                        <Image src={twitter} alt="Twitter" width={24} height={24} className="w-6 h-6" />
                    </a>
                )}
                {department.deptLinkedIn && (
                    <a href={department.deptLinkedIn} target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition-all flex items-center justify-center' title="LinkedIn">
                        <Image src={linkedin2} alt="LinkedIn" width={24} height={24} className="w-6 h-6" />
                    </a>
                )}
                {department.tiktokLink && (
                    <a href={department.tiktokLink} target="_blank" rel="noopener noreferrer" className='bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm text-gray-700 hover:text-black transition-all hover:scale-110 border border-gray-100' title="TikTok">
                        <Music2 size={18} />
                    </a>
                )}
                {department.deptEmail && (
                    <a href={`mailto:${department.deptEmail}`} className='bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm text-gray-700 hover:text-primary transition-all hover:scale-110 border border-gray-100' title="Email">
                        <Mail size={18} />
                    </a>
                )}
            </div>
        </div>
    )

    return (
        <div className='font-poppins min-h-screen bg-white'>
            <DepartmentHero
                title={department.name}
                subtitle={department.deptAbbreviation || "GESA"}
                text={department.deptAbbreviation ? `Official page of the Department of ${department.name} at KNUST.` : 'Empowering students with cutting-edge knowledge and tools to shape the future of technology.'}
                backLink="/department"
                backText="Back to Departments"
                titleClassName="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
                images={
                    id === '5DubyPtyt83ot1Zz3M6IAG'
                        ? ['/images/electrical-dept/electrical-dept-1.jpeg']
                        : id === '2Gv7b1DF3myjGGSWWTLCZ'
                            ? ['/images/biomed-dept/biomed-dept-1.jpg', '/images/biomed-dept/biomed-dept-2.jpg', '/images/biomed-dept/biomed-dept-3.jpg']
                            : id === '327nW8BQQ1VP3PQtlWWQWy'
                                ? ['/images/agric-dept/agric-dept-1.jpeg', '/images/agric-dept/agric-dept-2.0.jpeg', '/images/agric-dept/ages-dept-1.jpg']
                                : id === '55DSL3hJVQFf9UNctzCkOv'
                                    ? ['/images/ages-dept/ages-dept-1.jpg', '/images/ages-dept/ages-dept-2.jpg', '/images/ages-dept/ages-dept-3.jpg']
                                    : ['/images/dept/dept-3.jpg', '/images/dept/dept-2.jpeg', '/images/dept/dept-1.jpeg']
                }
            />
            <Container size='xl'>
                <div className='py-8'>
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className='flex items-center justify-center gap-2 sm:gap-4 w-full h-14 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100'>
                            <TabsTrigger className='flex-1 cursor-pointer py-2.5 text-sm sm:text-base' value="about">About Us</TabsTrigger>
                            <TabsTrigger className='flex-1 cursor-pointer py-2.5 text-sm sm:text-base' value="mission">Mission</TabsTrigger>
                            <TabsTrigger className='flex-1 cursor-pointer py-2.5 text-sm sm:text-base' value="vision">Vision</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>{department.deptAbbreviation || 'GESA'} - KNUST</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>{department.name}</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.about ? documentToReactComponents(department.about.json, options) : <p className="italic text-gray-500">Information coming soon...</p>}
                                </div>
                                <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                    {department.websiteLink && (
                                        <a href={department.websiteLink} target='_blank' rel='noopener noreferrer' className='bg-primary text-white px-10 py-4 cursor-pointer rounded-full w-max font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'>
                                            <Globe size={20} />
                                            Visit Website
                                        </a>
                                    )}
                                    <SocialLinks />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mission" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>{department.deptAbbreviation || 'GESA'} - KNUST</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Mission</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.mission ? documentToReactComponents(department.mission.json) : <p className="italic text-gray-500">Mission details are currently being updated.</p>}
                                </div>
                                <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                    {department.websiteLink && (
                                        <a href={department.websiteLink} target='_blank' rel='noopener noreferrer' className='bg-primary text-white px-10 py-4 cursor-pointer rounded-full w-max font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'>
                                            <Globe size={20} />
                                            Visit Website
                                        </a>
                                    )}
                                    <SocialLinks />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="vision" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>{department.deptAbbreviation || 'GESA'} - KNUST</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Vision</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.vision ? documentToReactComponents(department.vision.json) : <p className="italic text-gray-500">Vision statement is being finalized.</p>}
                                </div>
                                <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                    {department.websiteLink && (
                                        <a href={department.websiteLink} target='_blank' rel='noopener noreferrer' className='bg-primary text-white px-10 py-4 cursor-pointer rounded-full w-max font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'>
                                            <Globe size={20} />
                                            Visit Website
                                        </a>
                                    )}
                                    <SocialLinks />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </div>
    )
}

export default DepartmentContent
