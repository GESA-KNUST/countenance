'use client';
import React from 'react';
import useBlogCollection from '../../hooks/useBlogCollection';
import BlogCard from './BlogCard';

const RecentBlogs = ({ onPostSelect }: { onPostSelect?: (post: any) => void }) => {
    const { data: blogs, isLoading, error } = useBlogCollection();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading blog posts</div>;
    }

    return (
        <div className='px-4 md:px-8 lg:px-12 py-12 font-poppins'>
            <div className='max-w-7xl mx-auto flex flex-col gap-8'>
                <h1 className='font-open_sans text-2xl md:text-3xl font-bold text-gray-900'>Recent Blog Posts</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {blogs?.map((post) => (
                        <BlogCard
                            key={post.slug}
                            post={post}
                            slug={post.title}
                            author={{
                                title: post.author.name,
                                url: post.author.authorProfilePicture.url,
                            }}
                            headerImg={post.headerImage}
                            onPostSelect={onPostSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentBlogs;
