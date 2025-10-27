import Image from 'next/image';
import React from 'react'
import img1 from '../../public/images/img1.png'
import { ArrowUpRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className='relative min-h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center'>

      {/* Background Image */}
      <Image
        src={img1}
        alt='img'
        fill
        className='object-cover'
        priority
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/65 z-10' />

      {/* Content */}
      <div className='relative z-20 flex flex-col items-center justify-center text-white px-4 text-center max-w-360 mx-auto gap-6 -mt-32'>
        <h1 className='font-bold text-4xl leading-12 sm:text-[60px] sm:leading-16 md:text-[72px] md:leading-[76px] xl:text-[90px] lg:leading-[90px]'>
          Innovating Tomorrow's <span className='text-primary'>Engineers</span>, Today
        </h1>

        <p className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'>
          Empowering students with cutting-edge knowledge, hands-on experience,
          and the tools to shape the future of technology and innovation.
        </p>

        <button className="bg-primary font-semibold rounded-lg flex items-center gap-1 md:px-6 px-4 py-2 cursor-pointer text-black md:text-base text-sm">
          Explore more <ArrowUpRight className='text-black' strokeWidth={2.5} size={28} />
        </button>
      </div>

    </div>
  )
}

export default HeroSection;
