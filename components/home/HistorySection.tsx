"use client";

import React from 'react';
import Container from '../custom/Container';
import Image from "next/image";
import { motion } from "framer-motion";
import { History, Target, Zap, GraduationCap, Users, Lightbulb } from "lucide-react";

const historyData = {
    history: [
        "Founded in 1967 as the official voice for all engineering students at KNUST.",
        "Emerged alongside the School of Engineering's growth since 1952.",
        "Representative of Civil, Electrical, and Mechanical Engineering since inception.",
        "Mandated to foster academic excellence and create platforms for leadership.",
        "A legacy built on nearly six decades of engineering tradition and student advocacy."
    ],
    activities: [
        "Engineer's Festival: A signature week-long celebration of innovation and exhibitions.",
        "Mindset Revolution: Transformative personal development workshops.",
        "Tech Seminars: Masterclasses on AI, automation, and sustainable energy.",
        "Leadership Training: Capacity building for the next generation of academic leaders.",
        "STEM Outreach: Community projects aimed at inspiring secondary school students."
    ],
    funFacts: [
        {
            icon: Users,
            title: "Oldest Association",
            description: "One of the pioneering and oldest student bodies at KNUST."
        },
        {
            icon: GraduationCap,
            title: "Largest Population",
            description: "The College of Engineering is the largest in KNUST by student count."
        },
        {
            icon: Lightbulb,
            title: "Engineering Week",
            description: "ENG Week has been a campus highlight for over four decades."
        },
        {
            icon: Zap,
            title: "Global Alumni",
            description: "GESA alumni lead top sectors in energy, aviation, and tech worldwide."
        }
    ]
};

const HistorySection = () => {
    return (
        <section className="pt-12 pb-8 md:py-24 bg-white font-header">
            <Container size="xl" className="!pt-0">
                <div className="flex flex-col gap-24">
                    {/* Header */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4 relative z-10"
                        >
                            Our Heritage
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900"
                        >
                            The GESA Journey
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-600 leading-relaxed"
                        >
                            Since 1967, the Ghana Engineering Students' Association has been at the forefront of academic excellence, student leadership, and industrial innovation at KNUST.
                        </motion.p>
                    </div>

                    {/* Section 1: History */}
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="w-full lg:w-[55%] relative"
                        >
                            <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-xl relative z-10 border border-slate-100 bg-white">
                                <Image
                                    src="/images/history_legacy.jpeg"
                                    alt="GESA Legacy"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="w-full lg:w-[45%] space-y-8"
                        >
                            <div className="flex items-center gap-4 text-primary">
                                <History size={32} />
                                <h3 className="text-2xl font-bold">Our Rich History</h3>
                            </div>
                            <ul className="space-y-6">
                                {historyData.history.map((item, i) => (
                                    <li key={i} className="flex gap-4 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Section 2: Activities (Reversed) */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="w-full lg:w-[55%] relative"
                        >
                            <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-xl relative z-10 border border-slate-100 bg-white">
                                <Image
                                    src="/images/engineering_activities.jpg"
                                    alt="GESA Activities"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="w-full lg:w-[45%] space-y-8"
                        >
                            <div className="flex items-center gap-4 text-primary">
                                <Target size={32} />
                                <h3 className="text-2xl font-bold">What We Do</h3>
                            </div>
                            <ul className="space-y-6">
                                {historyData.activities.map((item, i) => (
                                    <li key={i} className="flex gap-4 group">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Section 3: Fun Facts Grid */}
                    <div className="pt-8 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {historyData.funFacts.map((fact, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 70,
                                        damping: 20,
                                        delay: i * 0.1
                                    }}
                                    className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/20 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                        <fact.icon size={28} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{fact.title}</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {fact.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HistorySection;
