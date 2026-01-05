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
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16 justify-center overflow-hidden py-12 border-b border-slate-100 last:border-0`}
        >
            {/* Image Section */}
            <div className='w-full lg:w-[480px] h-[350px] sm:h-[450px] relative rounded-3xl overflow-hidden shadow-xl group'>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 transition-opacity group-hover:opacity-0" />
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='object-cover hover:scale-105 transition-transform duration-700'
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <User size={80} />
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className='flex flex-col gap-6 lg:w-1/2 w-full text-center lg:text-left items-center lg:items-start'>
                <div className="space-y-3 p-4">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        {member.role}
                    </span>
                    <h2 className='font-bold text-3xl md:text-4xl font-header text-slate-900 leading-tight'>
                        {member.name}
                    </h2>
                    <p className='text-lg text-slate-500 font-medium'>{member.year} {member.major}</p>
                </div>

                <div className='font-light text-lg text-slate-600 leading-relaxed max-w-xl'>
                    {member.description.slice(0, 180)}...
                </div>

                <Link href={`/about/${member.slug}`}>
                    <Button
                        className="bg-primary text-black font-bold px-8 py-6 rounded-full hover:scale-105 transition-transform text-base shadow-lg hover:shadow-primary/20 flex items-center gap-2 group cursor-pointer"
                    >
                        Read More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

export default TeamCard;
