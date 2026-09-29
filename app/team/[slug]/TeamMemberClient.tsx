'use client';

import Image from 'next/image';
import { ctfSrc } from '@/lib/contentful-src';
import Link from 'next/link';
import Container from '@/components/custom/Container';
import { Github, Linkedin, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TeamMember } from '@/lib/data/team';
import TeamSwitcher from './TeamSwitcher';

interface TeamMemberClientProps {
    member: TeamMember;
    members: TeamMember[];
}

const TeamMemberClient = ({ member, members }: TeamMemberClientProps) => {
    return (
        <div className="min-h-screen bg-slate-50 font-poppins pb-12" suppressHydrationWarning>
            {/* Hero Section */}
            <div className="border-b border-slate-200 bg-white">
                <Container size="xl">
                    <Link
                        href="/team"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        All the team
                    </Link>

                    <div className="mt-8 grid grid-cols-1 items-center gap-8 md:mt-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 lg:gap-16">
                        <div className="relative mx-auto w-full max-w-[280px] md:mx-0 md:max-w-none">
                            <div
                                aria-hidden
                                className="absolute -bottom-3 -left-3 h-24 w-24 rounded-2xl bg-[#FFBE00] md:-bottom-4 md:-left-4 md:h-32 md:w-32"
                            />
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-black/5">
                                {member.image ? (
                                    <Image
                                        src={ctfSrc(member.image, 800, { height: 1000, focus: 'face' })}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 280px, 320px"
                                        priority
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                                        <User size={64} strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#FFBE00]" />
                                <p className="font-header text-xs font-bold uppercase tracking-[0.2em] text-[#B88900]">
                                    {member.role}
                                </p>
                            </div>

                            <h1 className="mt-4 font-header text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
                                {member.name}
                            </h1>

                            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                                <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
                                    {member.year}
                                </span>
                                <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-600">
                                    {member.major}
                                </span>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Content */}
            <Container size="xl" className="relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Portrait and Connect */}
                    <div className="lg:col-span-4 space-y-8">
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
                    <div className="lg:col-span-8 space-y-12">

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
                                        a: ({ node: _node, href, children, ...props }) => {
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
                                        a: ({ node: _node, href, children, ...props }) => {
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
                            <motion.figure
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10"
                            >
                                <figcaption className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-[#FFBE00]" />
                                    <span className="font-header text-xs font-bold uppercase tracking-[0.2em] text-[#B88900]">
                                        Fun fact
                                    </span>
                                </figcaption>

                                <blockquote className="mt-5 font-header text-xl leading-relaxed text-slate-800 md:text-2xl">
                                    {member.slug === 'obrempong-kwabena-osei-wusu'
                                        ? `“${member.funFact}”`
                                        : member.funFact}
                                </blockquote>

                                {member.slug === 'obrempong-kwabena-osei-wusu' && (
                                    <p className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                                        <span className="h-px w-6 bg-slate-300" />
                                        {member.name}
                                    </p>
                                )}
                            </motion.figure>
                        )}

                        {/* Navigation Footer */}
                        <div className="pt-6 sm:pt-12 border-t border-slate-200 mt-6 sm:mt-12 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-slate-500 text-xs sm:text-sm text-center sm:text-left">
                            <div>
                                <span className="block whitespace-nowrap font-medium text-slate-900">GESA Web Application Development Team</span>
                                <span className="block text-[10px] sm:text-xs text-yellow-600 mt-0.5 font-bold">Built for engineers by engineers</span>
                            </div>
                            <TeamSwitcher members={members} currentSlug={member.slug} />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TeamMemberClient;
