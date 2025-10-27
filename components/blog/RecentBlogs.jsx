import React from 'react'
import BlogCard from '../blog/BlogCard'


const RecentBlogs = () => {
    return (
        <div className='md:px-page-x lg:py-page-y px-page-sx font-poppins my-16'>
            <div className='max-w-7xl mx-auto flex flex-col gap-6'>
                <h1 className='font-open_sans text-2xl font-bold'>Recent Blog Posts</h1>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 my-10 gap-x-20 gap-y-10'>
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                    <BlogCard />
                </div>
            </div>
        </div>
    )
}

export default RecentBlogs;

/* 
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-12 font-poppins">
            <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
                <h1 className="font-open_sans text-2xl sm:text-3xl font-bold text-gray-800">
                    Recent Blog Posts
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8 mt-8">
                    {[...Array(6)].map((_, i) => (
                        <BlogCard key={i} />
                    ))}
                </div>
            </div>
        </div>
*/