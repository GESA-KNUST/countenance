'use client'

import Container from '@/components/custom/Container'
import DepartmentHero from '@/components/department/DepartmentHero'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import star from '@/public/images/star.svg'
import Image from 'next/image'
import { Globe, School, LayoutGrid, ChevronRight, Mail, Music2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useFaculty } from '@/hooks/useFaculty'
import StarSpinner from '@/components/ui/StarSpinner'
import whatsapp2 from '@/public/images/whatsapp2.svg'
import twitter from '@/public/images/twitter.svg'
import linkedin2 from '@/public/images/linkedin2.svg'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const FacultyDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const { data: faculty, isLoading, error } = useFaculty(id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <StarSpinner />
            </div>
        );
    }

    if (error || !faculty) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <School className="text-red-500 w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 font-header text-gray-900">Faculty Not Found</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">We couldn't load the details for this faculty. It might have been moved or doesn't exist.</p>
                    <Link href="/faculty" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20">
                        Back to Faculties
                    </Link>
                </div>
            </div>
        );
    }

    const SocialLinks = () => (
        <div className='flex items-center gap-4 mt-2'>
            <div className='flex items-center gap-5 bg-gray-100/50 p-2.5 px-6 rounded-full border border-gray-200 shadow-sm'>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mr-2'>Connect</p>
                {faculty.facultyLinkedIn && (
                    <a href={faculty.facultyLinkedIn} target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition-all flex items-center justify-center' title="LinkedIn">
                        <Image src={linkedin2} alt="LinkedIn" width={24} height={24} className="w-6 h-6" />
                    </a>
                )}
                {faculty.facultyTwitter && (
                    <a href={faculty.facultyTwitter} target="_blank" rel="noopener noreferrer" className='hover:scale-110 transition-all flex items-center justify-center' title="X (Twitter)">
                        <Image src={twitter} alt="Twitter" width={24} height={24} className="w-6 h-6" />
                    </a>
                )}
                {faculty.facultyMail && (
                    <a href={`mailto:${faculty.facultyMail}`} className='bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-sm text-gray-700 hover:text-primary transition-all hover:scale-110 border border-gray-100' title="Email">
                        <Mail size={18} />
                    </a>
                )}
            </div>
        </div>
    )

    return (
        <div className='font-poppins min-h-screen bg-white'>
            <DepartmentHero
                title={faculty.name}
                subtitle="Faculty"
                text={`Official page of the ${faculty.name} at KNUST.`}
                images={faculty.facultyMainImageCollection?.items?.map(item => item.url) || ['/images/img2.png', '/images/img1.png']}
                titleClassName="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            />
            <Container size='xl'>
                <div className='py-8'>
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className='flex items-center justify-start md:justify-center gap-2 w-full h-auto bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar'>
                            <TabsTrigger className='flex-shrink-0 flex-1 cursor-pointer py-2.5 px-4 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-xl' value="about">About Faculty</TabsTrigger>
                            <TabsTrigger className='flex-shrink-0 flex-1 cursor-pointer py-2.5 px-4 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-xl' value="departments">Departments</TabsTrigger>
                            <TabsTrigger className='flex-shrink-0 flex-1 cursor-pointer py-2.5 px-4 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-xl' value="mission">Mission</TabsTrigger>
                            <TabsTrigger className='flex-shrink-0 flex-1 cursor-pointer py-2.5 px-4 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-xl' value="vision">Vision</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>GESA - KNUST</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-4xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>{faculty.name}</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg text-gray-700 space-y-6 max-w-none leading-relaxed'>
                                    {faculty.about ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            components={{
                                                p: ({ node, ...props }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg" {...props} />,
                                                ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                li: ({ node, ...props }: any) => <li className="mb-2 pl-2" {...props} />
                                            }}
                                        >
                                            {faculty.about}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="italic text-gray-500">Information coming soon...</p>
                                    )}
                                </div>

                                <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                    {faculty.facultyWebsite && (
                                        <a href={faculty.facultyWebsite} target='_blank' rel='noopener noreferrer' className='bg-primary text-white px-10 py-4 cursor-pointer rounded-full w-max font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'>
                                            <Globe size={20} />
                                            Visit Website
                                        </a>
                                    )}
                                    <SocialLinks />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="departments" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>Our Departments</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {faculty.departmentsUnderFacultyCollection?.items?.length > 0 ? (
                                        faculty.departmentsUnderFacultyCollection.items.map((dept) => (
                                            <Link
                                                key={dept.sys.id}
                                                href={`/department-detail?id=${dept.sys.id}`}
                                                className="group bg-white border border-gray-100 p-6 rounded-3xl hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex items-center gap-4"
                                            >
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-primary/10 transition-colors">
                                                    {dept.deptLogo?.url ? (
                                                        <Image src={dept.deptLogo.url} alt={dept.name} width={40} height={40} className="object-contain" />
                                                    ) : (
                                                        <LayoutGrid size={24} className="text-gray-300 group-hover:text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">{dept.deptAbbreviation}</span>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{dept.name}</h3>
                                                </div>
                                                <ChevronRight className="text-gray-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">No departments linked to this faculty yet.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mission" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>Faculty Mission</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-4xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Mission</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg text-gray-700 space-y-6 max-w-none leading-relaxed'>
                                    {faculty.mission ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            components={{
                                                p: ({ node, ...props }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg" {...props} />,
                                                ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                li: ({ node, ...props }: any) => <li className="mb-2 pl-2" {...props} />
                                            }}
                                        >
                                            {faculty.mission}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="italic text-gray-500">Mission details are currently being updated.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="vision" className='py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                            <div className='flex flex-col gap-8'>
                                <div className='flex items-center gap-3'>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                    <p className='text-primary font-bold text-sm tracking-wider uppercase'>Faculty Vision</p>
                                    <Image src={star} alt="star" width={14} height={14} className='w-4 h-4' />
                                </div>
                                <h1 className='text-4xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'>Our Vision</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <div className='text-lg text-gray-700 space-y-6 max-w-none leading-relaxed'>
                                    {faculty.vision ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            components={{
                                                p: ({ node, ...props }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg" {...props} />,
                                                ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-6 text-gray-700 text-lg" {...props} />,
                                                li: ({ node, ...props }: any) => <li className="mb-2 pl-2" {...props} />
                                            }}
                                        >
                                            {faculty.vision}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="italic text-gray-500">Vision statement is being finalized.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </div>
    )
}

export default FacultyDetailPage
