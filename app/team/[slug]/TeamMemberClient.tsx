'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/custom/Container';
import { Github, Linkedin, User, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TeamMember } from '@/lib/data/team';

interface TeamMemberClientProps {
    member: TeamMember;
}

const TeamMemberClient = ({ member }: TeamMemberClientProps) => {
    return (
        <div className="min-h-screen bg-slate-50 font-poppins pb-12" suppressHydrationWarning>
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[500px] lg:h-[85vh] w-full bg-slate-900 overflow-hidden flex items-end shadow-2xl">
                <div className="absolute inset-0 z-0">
                    {member.image ? (
                        <div className="absolute right-0 top-0 w-full md:w-2/3 h-full">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover object-top opacity-80"
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20" />
                    )}
                </div>

                <Link
                    href="/team"
                    className="absolute top-0 left-0 z-50 inline-flex lg:hidden items-center text-yellow-500 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-br-2xl transition-all backdrop-blur-sm border-b border-r border-white/10"
                >
                    <ArrowLeft className="mr-2" size={18} />
                    <span className="text-sm font-medium">Back to Team</span>
                </Link>

                <Container size="xl" className="relative z-20 w-full mb-16">
                    <Link
                        href="/team"
                        className="hidden lg:inline-flex items-center text-yellow-500 hover:text-yellow-400 hover:bg-white/10 px-4 py-2 rounded-full transition-all group mb-8 backdrop-blur-sm border border-transparent hover:border-white/20"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
                        <span className="text-sm font-medium">Back to Team</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-md uppercase tracking-widest shadow-[0_0_15px_rgba(255,190,0,0.5)]">
                                {member.role}
                            </span>
                            <span className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold font-header text-white tracking-tight leading-none mb-4 drop-shadow-lg">
                            {member.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-yellow-500 font-medium max-w-2xl drop-shadow-lg">
                            {member.year} {member.major}
                        </p>
                    </motion.div>
                </Container>
            </div>

            {/* Main Content */}
            <Container size="xl" className="mt-2 lg:-mt-20 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Portrait and Connect */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Portrait Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="bg-white p-3 rounded-[2rem] shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 hidden lg:block"
                        >
                            <div className="aspect-[4/5] relative rounded-[1.5rem] overflow-hidden bg-slate-200 shadow-inner">
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                        <User size={80} strokeWidth={1} />
                                        <span className="text-xs uppercase tracking-widest mt-2">{member.name}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hidden lg:block"
                        >
                            <div className="flex gap-3">
                                {member.socials?.github && (
                                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl flex justify-center transition-all group border border-slate-100">
                                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {member.socials?.linkedin && (
                                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-slate-50 hover:bg-[#0077b5] hover:text-white rounded-xl flex justify-center transition-all group border border-slate-100">
                                        <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}

                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-8 lg:pt-24 space-y-12">

                        {/* Bio Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold font-header text-slate-900 mb-6">About</h2>
                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-8 text-[1.05rem]">
                                <div className="mb-6">
                                    <ReactMarkdown components={{
                                        a: ({ node, href, children, ...props }) => {
                                            const isInternal = href?.startsWith('/');
                                            if (isInternal) {
                                                return (
                                                    <Link href={href as string} className="text-primary hover:underline font-bold" {...props}>
                                                        {children}
                                                    </Link>
                                                );
                                            }
                                            return (
                                                <a href={href} className="text-primary hover:underline font-bold" target='_blank' rel="noopener noreferrer" {...props}>
                                                    {children}
                                                </a>
                                            );
                                        }
                                    }}>
                                        {member.description}
                                    </ReactMarkdown>
                                </div>
                                {member.about && (
                                    <ReactMarkdown components={{
                                        a: ({ node, href, children, ...props }) => {
                                            const isInternal = href?.startsWith('/');
                                            if (isInternal) {
                                                return (
                                                    <Link href={href as string} className="text-primary hover:underline font-bold" {...props}>
                                                        {children}
                                                    </Link>
                                                );
                                            }
                                            return (
                                                <a href={href} className="text-primary hover:underline font-bold" target='_blank' rel="noopener noreferrer" {...props}>
                                                    {children}
                                                </a>
                                            );
                                        }
                                    }}>
                                        {member.about}
                                    </ReactMarkdown>
                                )}
                            </div>

                            {/* Mobile Social Links */}
                            <div className="flex gap-3 mt-8 lg:hidden">
                                {member.socials?.github && (
                                    <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-white hover:bg-slate-900 hover:text-white rounded-xl flex justify-center transition-all group border border-slate-200 shadow-sm">
                                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {member.socials?.linkedin && (
                                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-white hover:bg-[#0077b5] hover:text-white rounded-xl flex justify-center transition-all group border border-slate-200 shadow-sm">
                                        <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}

                            </div>
                        </motion.div>

                        {/* Fun Fact Section */}
                        {member.funFact && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative bg-slate-900 rounded-3xl p-8 md:p-10 overflow-hidden shadow-xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shrink-0">
                                        <Sparkles className="text-primary w-8 h-8 fill-primary" />
                                    </div>
                                    <div>
                                        <span className="block text-primary font-bold uppercase tracking-widest text-xs mb-2">Fun Fact</span>
                                        <p className="text-xl md:text-2xl font-medium text-white italic leading-relaxed">
                                            {member.slug === 'obrempong-kwabena-osei-wusu'
                                                ? `"${member.funFact}" - Obrempong Kwabena Osei-Wusu`
                                                : member.funFact
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Footer */}
                        <div className="pt-6 sm:pt-12 border-t border-slate-200 mt-6 sm:mt-12 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-slate-500 text-xs sm:text-sm text-center sm:text-left">
                            <div>
                                <span className="block whitespace-nowrap font-medium text-slate-900">GESA Web Application Development Team</span>
                                <span className="block text-[10px] sm:text-xs text-yellow-600 mt-0.5 font-bold">Built for engineers by engineers</span>
                            </div>
                            <Link href="/team" className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap font-medium group text-slate-900">
                                View all members
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TeamMemberClient;
