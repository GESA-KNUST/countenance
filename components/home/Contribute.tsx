"use client"
import React from 'react'
import Container from '../custom/Container';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import useBlogCollection from '@/hooks/useBlogCollection';
import BlogCard from '../blog/BlogCard';
import FetchError from '../custom/FetchError';

const Contribute = () => {

    const { data: blogs, error } = useBlogCollection()

    if (error) {
        return <FetchError />
    }

    return (
        <Container size='xl' className='font-poppins py-16'>
            <div className="flex flex-col gap-10">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-header font-bold text-gray-900">Recent Stories</h2>
                        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                            Read our latest blogs to stay updated with the latest trends, insights, and stories from the GESA community.
                        </p>
                    </div>
                    <Link href="/blog" className="hidden md:block">
                        <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/5">
                            View All Stories <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs?.slice(0, 2).map((post) => (
                        <BlogCard
                            key={post.slug}
                            post={post}
                            slug={post.title}
                            author={{
                                title: post.author.name,
                                url: post.author.authorProfilePicture.url,
                            }}
                            headerImg={post.headerImage}
                        />
                    ))}

                    {/* Contribute Card */}
                    <div className="relative group overflow-hidden rounded-xl bg-primary min-h-[400px] flex flex-col justify-between p-8 text-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-12 -mb-12" />

                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4">
                                <span className="font-header font-bold text-xl">?</span>
                            </div>
                            <h3 className="font-header text-3xl font-bold leading-tight">
                                Have a story to share?
                            </h3>
                            <p className="text-black/80 font-medium leading-relaxed">
                                Contribute to the GESA blogs and share your knowledge, experiences, and insights with the entire engineering community.
                            </p>
                        </div>

                        <div className="relative z-10 pt-8">
                            <Link href="https://forms.gle/kxMYY1xN5JWMiZdYA" className="cursor-pointer">
                                <Button className="w-full bg-black text-white hover:bg-black/80 border-0 h-12 rounded-lg font-semibold text-base transition-all duration-300 group-hover:shadow-lg">
                                    Contribute to GESA Blogs <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex justify-center mt-4">
                    <Link href="/blog">
                        <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                            View All Stories <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default Contribute;