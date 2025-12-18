'use client';
import React from 'react';
import useBlogCollection from '../../hooks/useBlogCollection';
import BlogCard from '../blog/BlogCard';
import Container from '../custom/Container';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const HomeBlogPreview = () => {
    const { data: blogs, isLoading, error } = useBlogCollection();

    if (isLoading || error || !blogs) {
        return null; // Or skeleton
    }

    // Get latest 3 blogs
    const recentBlogs = blogs.slice(0, 3);

    return (
        <div className='py-12 font-poppins bg-white'>
            <Container size='xl'>
                <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">From the Blog</h2>
                            <p className="text-gray-500">Insights, innovations, and student stories.</p>
                        </div>
                        <Link href="/blog">
                            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10">
                                Read More <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {recentBlogs.map((post) => (
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
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default HomeBlogPreview;
