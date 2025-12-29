"use client"
import React from 'react'
import Container from '../custom/Container';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import useBlogCollection from '@/hooks/useBlogCollection';
import BlogCard from '../blog/BlogCard';
import FetchError from '../custom/FetchError';

import { motion } from "framer-motion";

const Contribute = () => {

    const { data: blogs, error } = useBlogCollection()

    if (error) {
        return <FetchError />
    }

    return (
        <Container size='xl' className='font-poppins py-16'>
            <div className="flex flex-col gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex justify-between items-center"
                >
                    <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-header font-bold text-gray-900">Recent Stories</h2>
                        <p className="text-gray-500 text-sm md:text-lg max-w-2xl leading-relaxed">
                            Stay updated with insights, innovation highlights, and community stories from the forefront of KNUST Engineering.
                        </p>
                    </div>
                    <Link href="/blog" className="hidden md:block">
                        <Button variant="ghost" className="text-base gap-2 text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-300">
                            View All Stories <ArrowRight size={16} />
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs?.slice(0, 2).map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <BlogCard
                                post={post}
                                slug={post.title}
                                author={{
                                    title: post.author.name,
                                    url: post.author.authorProfilePicture.url,
                                }}
                                headerImg={post.headerImage}
                            />
                        </motion.div>
                    ))}

                    {/* Contribute Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="relative group overflow-hidden rounded-3xl bg-primary min-h-[420px] flex flex-col justify-between p-10 text-black transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border border-primary/20"
                    >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/30 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl -ml-16 -mb-16" />

                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <span className="font-header font-bold text-3xl">?</span>
                            </div>
                            <div>
                                <h3 className="font-header text-3xl font-bold leading-tight mb-4">
                                    Have a story to share?
                                </h3>
                                <p className="text-black/70 font-bold leading-relaxed text-lg">
                                    Contribute to the GESA blogs and share your knowledge, experiences, and insights with the global engineeeing community.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 pt-10">
                            <Link href="https://forms.gle/kxMYY1xN5JWMiZdYA" className="cursor-pointer">
                                <Button className="w-full bg-black text-white hover:bg-gray-900 border-0 h-14 rounded-2xl font-bold text-lg transition-all duration-300 group-hover:shadow-xl shadow-md">
                                    Contribute Now <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="md:hidden flex justify-center mt-6">
                    <Link href="/blog">
                        <Button variant="ghost" className="gap-2 text-primary font-bold">
                            View All Stories <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default Contribute;