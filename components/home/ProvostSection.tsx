'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '../custom/Container';
import { Award, BookOpen, GraduationCap, Briefcase } from 'lucide-react';

const ProvostSection = () => {
    const highlights = [
        {
            icon: <GraduationCap className="w-5 h-5" />,
            text: "30 Years Experience",
            label: "Teaching & Research"
        },
        {
            icon: <Award className="w-5 h-5" />,
            text: "Provost",
            label: "College of Engineering"
        },
        {
            icon: <BookOpen className="w-5 h-5" />,
            text: "100+ Publications",
            label: "Peer-reviewed Journals"
        },
        {
            icon: <Briefcase className="w-5 h-5" />,
            text: "Patron",
            label: "GESA-KNUST"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <Container size="xl">
                <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full lg:w-1/2 flex flex-col gap-12 lg:-mt-4"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/10 rounded-[2.5rem] -rotate-3 transition-transform group-hover:rotate-0 duration-500" />
                            <div className="absolute -inset-4 border-2 border-primary/20 rounded-[2.5rem] rotate-2 transition-transform group-hover:rotate-0 duration-500" />

                            <div className="relative h-[500px] sm:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl z-10">
                                <Image
                                    src="/images/Provost.jpg"
                                    alt="Professor Kwabena Biritwum Nyarko"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-100 hidden md:block"
                            >
                                <p className="text-primary font-bold text-lg mb-1">GESA Patron</p>
                                <p className="text-gray-500 text-sm font-medium leading-tight">Celebrating Excellence &<br />Leadership at KNUST</p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {highlights.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="text-primary mb-2 bg-primary/5 w-fit p-2 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {item.text}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                        {item.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase">
                                <Award className="w-4 h-4" />
                                GESA PATRON
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 font-header leading-[1.1]">
                                Prof. Kwabena <span className="text-primary">Biritwum Nyarko</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-600 font-medium">
                                Provost, College of Engineering — KNUST
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg text-gray-600 max-w-none space-y-4"
                        >
                            <p className="leading-relaxed">
                                {`Professor Kwabena Biritwum Nyarko is a Professor at the Civil Engineering Department of Kwame Nkrumah University of Science and Technology, Kumasi, Ghana. He has 30 years of teaching and research experience in Water and Sanitation. His research focuses on water transport and distribution, sanitation technologies, and sustainable water and sanitation service delivery.`}
                            </p>
                            <p className="leading-relaxed hidden sm:block">
                                {`He is the Provost of the College of Engineering at KNUST and a valued member of the Regional Water and Sanitation Centre, Kumasi (RWESCK). He serves on the Board of the Engineering Council of Ghana and is a Council member of the Ghana Institution of Engineers.`}
                            </p>
                            <p className="leading-relaxed italic text-sm text-gray-500">
                                {`Prof Nyarko has over one hundred (100) publications in peer-reviewed journals, conference proceedings, and technical reports.`}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ProvostSection;
