'use client';
import Image from 'next/image';
import { useState } from 'react';
import logo from '../../public/images/logo2.svg'
import fb from '../../public/images/fb.svg'
import ig from '../../public/images/ig.svg'
import linkedin from '../../public/images/linkedIn.svg'
import x from '../../public/images/x.svg'

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
    <main className="flex min-h-screen flex-col items-center bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-2/3">

            
            <section className="flex flex-col items-center text-center mb-8">
                <div className="flex items-center justify-center gap-2.5 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFBE00" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                    <p className="font-bold text-sm uppercase text-[#FFBE00]" style={{fontFamily: "'DM Sans', sans-serif"}}>MASTER AGYAPONG ALBERT YEBOAH</p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFBE00" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                </div>
              <div className="relative mb-4">
                <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-[#252638] max-w-3xl">
                  The Ghana Engineering Students Association – GESA KNUST
                </h1>
              </div>
              <div className="relative w-[50px] h-1 bg-[#FFBE00] mt-4">
                <div className="absolute top-0 right-full mr-2 w-1 h-1 bg-[#FFBE00] rounded-full"></div>
              </div>
            </section>

            <div className="w-full h-[574px] bg-gray-200 mb-8">
                {/* Image placeholder */}
            </div>
            
            <p className="text-[#252638] text-lg leading-8">{mainContent}</p>

            <div className="flex items-center justify-start gap-5 mt-12 py-4">
                <Image src={logo} alt="logo" width={52} height={78} />
                <div className="w-[1px] h-[56px] bg-[#DDDDDD]"></div>
                <div className="flex items-center gap-4 pl-5">
                    <a href="#" className="w-10 h-10 border border-[#252638] rounded-full flex justify-center items-center p-[12px]"><Image src={fb} alt="facebook" /></a>
                    <a href="#" className="w-10 h-10 border border-[#252638] rounded-full flex justify-center items-center p-[12px]"><Image src={ig} alt="instagram" /></a>
                    <a href="#" className="w-10 h-10 border border-[#252638] rounded-full flex justify-center items-center p-[12px]"><Image src={linkedin} alt="linkedin" /></a>
                    <a href="#" className="w-10 h-10 border border-[#252638] rounded-full flex justify-center items-center p-[12px]"><Image src={x} alt="x" /></a>
                </div>
            </div>
          </div>

          
          <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:mt-32">
            <h2 className="text-3xl font-bold text-[#C4C4C4]">
              Popular Posts
            </h2>

            <div className="flex flex-col gap-8">
                {allPosts.slice(0, visiblePosts).map((post, index) => (
                    <div key={index}>
                        {post.type === 'large' ? (
                            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-full h-[240px] bg-gray-200"></div>
                                <p className="font-semibold text-sm text-[#FFBE00]">{post.subheading}</p>
                                <h3 className="text-2xl font-semibold text-[#101828] leading-tight">{post.heading}</h3>
                                <p className="text-[#667085] text-base">{post.supportingText}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-sm text-[#101828]">{post.author}</p>
                                        <p className="text-sm text-[#667085]">{post.authorRole}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-lg rounded-lg p-4 flex flex-row gap-4 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-[110px] h-[103px] bg-gray-200"></div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-sm text-[#FFBE00]">{post.subheading}</p>
                                    <h3 className="text-xl font-semibold text-[#101828] leading-tight">{post.heading}</h3>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {visiblePosts < allPosts.length && (
                 <button 
                 onClick={loadMore}
                 className="flex flex-row items-center justify-center py-3 px-6 rounded-lg bg-[#F9F5FF] border border-[#F9F5FF] shadow-xs w-auto self-center gap-2">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M10 4.16669V15.8334" stroke="#FFBE00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M4.16669 10L10 15.8334L15.8334 10" stroke="#FFBE00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <span className="font-medium text-base text-[#FFBE00]">Load More</span>
             </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}