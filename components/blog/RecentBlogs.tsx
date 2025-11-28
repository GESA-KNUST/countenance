'use client';
import React from 'react';
import useBlogCollection from '../../hooks/useBlogCollection';
import BlogCard from './BlogCard';

const RecentBlogs = () => {
    const { data: blogs, isLoading, error } = useBlogCollection();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading blog posts</div>;
    }

    return (
        <div className='md:px-page-x lg:py-page-y px-page-sx font-poppins my-16'>
            <div className='max-w-7xl mx-auto flex flex-col gap-6'>
                <h1 className='font-open_sans text-2xl font-bold'>Recent Blog Posts</h1>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 my-10 gap-x-20 gap-y-10'>
                    {blogs?.slice(0, 6).map((post) => (
                        <BlogCard
                            key={post._id}
                            slug={post.title}
                            author={{
                                title: post.author.name,
                                url: post.author.authorProfilePicture.url,
                                description: post.author.authorProfilePicture.description,
                            }}
                            headerImg={post.headerImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentBlogs;
