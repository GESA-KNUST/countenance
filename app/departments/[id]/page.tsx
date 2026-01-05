'use client'

import Container from '@/components/custom/Container'
import DepartmentHero from '@/components/department/DepartmentHero'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import star from '@/public/images/star.svg'
import Image from 'next/image'
import { Mail, Globe, Music2 } from 'lucide-react'
import Link from 'next/link'
import whatsapp2 from '@/public/images/whatsapp2.svg'
import twitter from '@/public/images/twitter.svg'
import linkedin2 from '@/public/images/linkedin2.svg'
import { useParams } from 'next/navigation'
import { useDepartment } from '@/hooks/useDepartment'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import StarSpinner from '@/components/ui/StarSpinner'

const DepartmentDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const { data: department, isLoading, error } = useDepartment(id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <StarSpinner />
            </div>
        );
    }

    if (error || !department) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="text-red-500 w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 font-header text-gray-900">Department Not Found</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">We couldn't load the details for this department. It might have been moved or doesn't exist.</p>
                    <Link href="/departments" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20">
                        Back to Departments
                    </Link>
                </div>
            </div>
        );
    }

    const richTextOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                const { url, description, width, height } = node.data.target.fields.file;
                return (
                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative">
                        <Image
                            src={`https:${url}`}
                            alt={description || 'Department Image'}
                            width={width || 800}
                            height={height || 500}
                            className="w-full h-auto object-cover"
                        />
                        {description && <p className="text-sm text-gray-500 mt-2 text-center italic">{description}</p>}
                    </div>
                );
            },
            [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
                return <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>;
            },
        },
    };

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
                subtitle={department.deptAbbreviation || "DEPARTMENT"}
                text={`Official page of the ${department.name} at KNUST.`}
                images={['/images/img2.png', '/images/img1.png']} // Fallback or fetch specific images if available
                titleClassName="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
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
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>{department.deptAbbreviation || 'DEPT'} - KNUST</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>{department.name}</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.about?.json ? documentToReactComponents(department.about.json, richTextOptions) : <p className="italic text-gray-500">Information coming soon...</p>}
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
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>Our Mission</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Mission</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.mission?.json ? documentToReactComponents(department.mission.json) : <p className="italic text-gray-500">Mission details are currently being updated.</p>}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="vision" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>Our Vision</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Vision</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg font-header text-gray-700 space-y-6 prose prose-lg max-w-none leading-relaxed'>
                                    {department.vision?.json ? documentToReactComponents(department.vision.json) : <p className="italic text-gray-500">Vision statement is being finalized.</p>}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </div>
    )
}

export default DepartmentDetailPage
