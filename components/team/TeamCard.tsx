'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { TeamMember } from '@/lib/data/team';
import { Button } from '../ui/button';

const TeamCard = ({ member, index }: { member: TeamMember, index: number }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`flex flex-col items-center gap-10 justify-center overflow-hidden w-full ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
            {/* Image Side */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='w-full md:w-[480px] lg:w-[500px] h-[400px] sm:h-[450px] overflow-hidden shadow-2xl relative rounded-[2.5rem] group'
            >
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <User size={100} strokeWidth={1} />
                    </div>
                )}

                {/* Overlay gradient for better depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Content Side */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`flex flex-col gap-6 lg:w-1/2 w-full px-4 lg:px-0 ${isEven ? 'lg:items-start lg:text-left' : 'lg:items-start lg:text-left'}`}
            >
                <div className="space-y-3">
                    <div className="inline-block px-4 py-1.5 bg-primary text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full">
                        {member.role}
                    </div>
                    <h3 className="font-bold text-3xl md:text-4xl lg:text-5xl font-header text-slate-900 leading-[1.1]">
                        {member.name}
                    </h3>
                    <p className="text-lg text-slate-500 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {member.major} • {member.year}
                    </p>
                </div>

                <p className="text-slate-600 leading-relaxed text-lg line-clamp-4 font-light">
                    {member.description}
                </p>

                <Link href={`/team/${member.slug}`} className="mt-2">
                    <Button
                        className="bg-slate-900 text-white hover:bg-primary hover:text-black rounded-full px-8 py-6 text-base font-bold group transition-all duration-300 shadow-lg hover:shadow-primary/25"
                    >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
};

export default TeamCard;
