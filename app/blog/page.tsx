import React from 'react'
import HeroSection from '../../components/blog/HeroSection'
import BigStory from '../../components/blog/BigStory'
import RecentBlog from '../../components/blog/RecentBlogs'
import img1 from "public/images/img1.png";
import img2 from "public/images/img2.png";
import Container from '@/components/custom/Container';

const page = () => {
  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection 
        title="Explore Our Latest Blog Posts"
        highlight="Blog Posts"
        text="Explore insights, innovations, and student experiences from the heart of KNUST's engineering community."
        images={[img2.src, img1.src, img2.src]}
      />
      <BigStory />
      <RecentBlog/>
    </div>
  )
}

export default page;
