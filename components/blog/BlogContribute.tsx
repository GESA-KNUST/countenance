'use client';
import React from 'react';
import Container from '../custom/Container';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, PenTool } from 'lucide-react';

const BlogContribute = () => {
    return (
        <Container size='xl' className='font-poppins py-16 pb-24'>
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-primary p-8 md:p-16 text-black transition-all duration-500 hover:shadow-[0_20px_50px_rgba(234,179,8,0.3)] border border-yellow-400/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl -ml-16 -mb-16" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 backdrop-blur-sm border border-black/5">
                            <PenTool size={32} className="text-black" />
                        </div>
                        <h2 className="font-header text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-black">
                            Have a story <br className="hidden md:block" /> to share?
                        </h2>
                        <p className="text-black/70 font-header text-lg md:text-xl max-w-xl leading-relaxed font-semibold">
                            Contribute to the GESA blogs and share your knowledge, experiences, and insights with the entire engineering community.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <Link href="https://forms.gle/kxMYY1xN5JWMiZdYA" className="cursor-pointer block">
                            <Button className="w-full md:w-auto bg-black text-white hover:bg-black/90 px-12 h-16 rounded-2xl font-header font-bold text-lg transition-all duration-300 group-hover:scale-[1.05] shadow-2xl active:scale-[0.98] flex items-center gap-3">
                                Contribute to GESA Blogs
                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default BlogContribute;
