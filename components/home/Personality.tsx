'use client'
import React from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import POTW from '../../public/images/potw.png'
import Container from '../custom/Container';

const Personality = () => {
  return (
    <div className='md:px-page-x lg:py-page-y font-poppins'>
      <Container size='xl'>
      <div className='my-16 flex flex-col lg:flex-row items-center gap-10 justify-center'>

        {/* Image */}
        <div className='w-full md:w-[480px] lg:w-[520px] overflow-hidden shadow-lg'>
          <Image
            src={POTW}
            alt='potw'
            className='object-cover w-full h-full hover:scale-105 transition-transform duration-500'
          />
        </div>

        {/* Content */}
        <div className='flex flex-col gap-4 xl:max-w-xl lg:w-1/2 w-full'>
          <div>
            <h1 className='font-bold xl:text-3xl text-2xl font-header'>PERSONALITY OF THE WEEK</h1>
            <p className='xl:text-[22px] text-medium-dark text-lg'>Celebrating Excellence and Innovation.</p>
          </div>
          <p className='font-light xl:text-xl'>This week, we highlight [Name], a [Year] student in [Department], who is pioneering new research in [Field] and demonstrating exceptional leadership in [Activity/Project]. [Name] embodies the spirit of [Engineering College's Name] through their dedication to [specific achievement or value], and their impact is shaping the future of [related industry or community].
          </p>
          <Button variant="default" size="default" className="xl:px-6 py-3 cursor-pointer text-black w-max xl:text-base text-sm">Read more</Button>
        </div>

      </div>
      </Container>
    </div>
  )
}

export default Personality;
