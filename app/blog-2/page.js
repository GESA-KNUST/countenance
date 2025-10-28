'use client';
import Image from 'next/image';
import { useState } from 'react';
import logo from '../../public/images/logo.svg'
import fb2 from '../../public/images/fb2.svg'
import twitter from '../../public/images/twitter.svg'
import yt from '../../public/images/yt.svg'
import linkedin2 from '../../public/images/linkedin2.svg'
import { Separator } from '../../components/ui/separator';
import BlogCard from '../../components/blog/BlogCard';

const allPosts = [
    {
        type: 'large',
        subheading: 'Subheading',
        heading: 'Heading',
        supportingText: 'Supporting text',
        author: 'Text',
        authorRole: 'Supporting text'
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
    {
        type: 'small',
        subheading: 'Subheading',
        heading: 'Heading',
    },
];


export default function Page() {
  const mainContent = `The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........The Ghana Engineering Students’ Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association........`;
  const [visiblePosts, setVisiblePosts] = useState(3);

  const loadMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
  };


  return (
    <main className="flex min-h-screen flex-col items-center bg-white font-poppins">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left column */}
          <div className="w-full lg:w-2/3">

            {/* Hero Section */}
            <section className="flex flex-col items-center text-center mb-8">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                    <p className="font-bold text-sm uppercase text-primary" style={{fontFamily: "'DM Sans', sans-serif"}}>AGYAPONG ALBERT YEBOAH</p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                </div>
              <div className="relative mb-4">
                <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-foreground max-w-3xl">
                  The Ghana Engineering Students Association – GESA KNUST
                </h1>
              </div>
              <div className="relative w-[50px] h-1 bg-primary mt-4">
                <div className="absolute top-0 right-full mr-2 w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </section>

            <Image src="/images/image-26.png" alt="blog image" width={800} height={574} className="w-full h-auto mb-8" />
            
            <p className="text-foreground text-lg leading-8">{mainContent}</p>

            <div className="flex items-center gap-4 mt-4">
            <Image src={logo} alt="logo" />
            <div className="h-10">
              <Separator orientation="vertical" className="w-full" />
            </div>
            <div className="flex gap-2">
              <Image src={fb2} alt="Facebook" />
              <Image src={twitter} alt="Twitter" />
              <Image src={yt} alt="YouTube" />
              <Image src={linkedin2} alt="LinkedIn" />
            </div>
          </div>
        </div>

          {/* Right column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:mt-32">
            <h2 className="text-3xl font-bold text-muted-foreground/50">
              Popular Posts
            </h2>

            <div className="flex flex-col gap-8">
                {allPosts.slice(0, visiblePosts).map((post, index) => (
                    <BlogCard key={index} />
                ))}
            </div>

            {visiblePosts < allPosts.length && (
                 <button 
                 onClick={loadMore}
                 className="flex flex-row items-center justify-center py-3 px-6 rounded-lg bg-primary/10 border border-primary/10 shadow-xs w-auto self-center gap-2">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M10 4.16669V15.8334" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M4.16669 10L10 15.8334L15.8334 10" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <span className="font-medium text-base text-primary">Load More</span>
             </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}