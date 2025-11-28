import React from 'react'
import HeroSection from '../../components/home/HeroSection'
import BigStory from '../../components/blog/BigStory'
import RecentBlog from '../../components/blog/RecentBlogs'

const page = () => {
  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection 
        title="Explore Our Latest Blog Posts"
        highlight="Blog Posts"
        images={[]}
      />
      <BigStory />
      <RecentBlog/>
    </div>
  )
}

export default page;
