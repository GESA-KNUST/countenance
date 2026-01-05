'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '../custom/Container';

const AboutHero = () => {
    return (
        <div className="relative h-[70vh] min-h-[600px] w-full bg-slate-900 overflow-hidden flex items-center">
            {/* Background Image Carousel/Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/img1.png"
                    alt="GESA Team"
                    fill
                    className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
            </div>

            <Container size="xl" className="relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold rounded-full uppercase tracking-widest mb-6">
                        Meet the Minds
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-header text-white tracking-tight leading-[1.1] mb-8">
                        Behind the <span className="text-primary italic">Platform</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed">
                        A dedicated team of engineering students united by a passion for technology and a commitment to the GESA community.
                    </p>
                </motion.div>
            </Container>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-l from-primary to-transparent z-20" />
            <div className="absolute bottom-12 right-12 w-24 h-24 border border-white/10 rounded-full z-20 animate-pulse" />
        </div>
    );
};

export default AboutHero;
