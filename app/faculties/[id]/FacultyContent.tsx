'use client'

import Container from '@/components/custom/Container'
import DepartmentHero from '@/components/department/DepartmentHero'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { Globe, School, LayoutGrid, ChevronRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useFaculty } from '@/hooks/useFaculty'
import PageLoader from '@/components/common/PageLoader'
import NotFoundCard from '@/components/common/NotFoundCard'
import SectionEyebrow from '@/components/common/SectionEyebrow'
import { markdownComponents } from '@/lib/markdownComponents'
import twitter from '@/public/images/twitter.svg'
import linkedin2 from '@/public/images/linkedin2.svg'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

const tabTriggerClass =
    'flex-shrink-0 flex-1 cursor-pointer py-2.5 px-4 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-xl'

const tabContentClass = 'py-12 animate-in fade-in slide-in-from-bottom-4 duration-500'

const headingClass = 'text-4xl md:text-5xl font-extrabold font-header text-gray-900 leading-tight'

/** Renders a markdown field with a graceful fallback when it is empty. */
const Markdown = ({ content, fallback }: { content?: string; fallback: string }) => (
    <div className="text-lg text-gray-700 space-y-6 max-w-none leading-relaxed">
        {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
                {content}
            </ReactMarkdown>
        ) : (
            <p className="italic text-gray-500">{fallback}</p>
        )}
    </div>
)

const FacultyContent = () => {
    const params = useParams();
    const id = params.id as string;
    const { data: faculty, isLoading, error } = useFaculty(id);

    if (isLoading) {
        return <PageLoader />;
    }

    if (error || !faculty) {
        return (
            <NotFoundCard
                icon={School}
                title="Faculty Not Found"
                message="We couldn't load the details for this faculty. It might have been moved or doesn't exist."
                backHref="/faculty"
                backText="Back to Faculties"
            />
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

    const WebsiteButton = () =>
        faculty.facultyWebsite ? (
            <a href={faculty.facultyWebsite} target='_blank' rel='noopener noreferrer' className='bg-primary text-white px-10 py-4 cursor-pointer rounded-full w-max font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'>
                <Globe size={20} />
                Visit Website
            </a>
        ) : null

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
                            <TabsTrigger className={tabTriggerClass} value="about">About Faculty</TabsTrigger>
                            <TabsTrigger className={tabTriggerClass} value="departments">Departments</TabsTrigger>
                            <TabsTrigger className={tabTriggerClass} value="mission">Mission</TabsTrigger>
                            <TabsTrigger className={tabTriggerClass} value="vision">Vision</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className={tabContentClass}>
                            <div className='flex flex-col gap-8'>
                                <SectionEyebrow label="GESA - KNUST" />
                                <h1 className={headingClass}>{faculty.name}</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <Markdown content={faculty.about} fallback="Information coming soon..." />
                                <div className='flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100'>
                                    <WebsiteButton />
                                    <SocialLinks />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="departments" className={tabContentClass}>
                            <div className='flex flex-col gap-8'>
                                <SectionEyebrow label="Our Departments" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {faculty.departmentsUnderFacultyCollection?.items?.length ? (
                                        faculty.departmentsUnderFacultyCollection.items.map((dept) => (
                                            <Link
                                                key={dept.sys.id}
                                                href={`/departments/${dept.sys.id}`}
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

                        <TabsContent value="mission" className={tabContentClass}>
                            <div className='flex flex-col gap-8'>
                                <SectionEyebrow label="Faculty Mission" />
                                <h1 className={headingClass}>Our Mission</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <Markdown content={faculty.mission} fallback="Mission details are currently being updated." />
                            </div>
                        </TabsContent>

                        <TabsContent value="vision" className={tabContentClass}>
                            <div className='flex flex-col gap-8'>
                                <SectionEyebrow label="Faculty Vision" />
                                <h1 className={headingClass}>Our Vision</h1>
                                <div className='w-20 h-2 bg-primary rounded-full'></div>
                                <Markdown content={faculty.vision} fallback="Vision statement is being finalized." />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>
        </div>
    )
}

export default FacultyContent
