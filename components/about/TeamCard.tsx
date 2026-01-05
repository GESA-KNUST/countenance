'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { TeamMember } from '@/lib/data/team';
import { Button } from '../ui/button';

const TeamCard = ({ member, index }: { member: TeamMember, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={100} strokeWidth={1} />
                    </div>
                )}

                {/* Role Badge - Floating */}
                <div className="absolute bottom-6 left-6 z-20">
                    <span className="px-5 py-2 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl">
                        {member.role}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10 flex flex-col gap-5">
                <div className="space-y-2">
                    <h3 className="font-bold text-2xl lg:text-3xl font-header text-slate-900 leading-tight">
                        {member.name}
                    </h3>
                    <p className="text-sm text-primary font-bold uppercase tracking-widest">
                        {member.year} • {member.major}
                    </p>
                </div>

                <p className="text-slate-500 leading-relaxed line-clamp-3 text-[0.95rem]">
                    {member.description}
                </p>

                <Link href={`/about/${member.slug}`} className="mt-2">
                    <Button
                        variant="ghost"
                        className="p-0 h-auto text-slate-900 font-bold hover:text-primary hover:bg-transparent flex items-center gap-2 group/btn"
                    >
                        Learn More
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover/btn:bg-primary/20 group-hover/btn:text-primary transition-all">
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

export default TeamCard;
