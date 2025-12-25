'use client'
import Container from '@/components/custom/Container'
import HeroSection from '@/components/home/HeroSection'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import star from '@/public/images/star.svg'
import Image from 'next/image'

const page = () => {

  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        title="Computer Engineering Department"
        highlight="Department"
        text='Choose from our diverse departments designed to equip you with skills, knowledge, and hands-on experience.'
        images={['/images/img1.png', '/images/img2.png']}
        button={false}
      />
      <Container size='xl'>
        <div className='py-2'>
          <Tabs defaultValue="about" className="w-full">
            <TabsList className='flex items-center justify-center gap-4 w-full h-12 cursor-pointer'>
              <TabsTrigger className='cursor-pointer' value="about">About Us</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="mission">Mission</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="vision">Vision</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className='py-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-2'>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                  <p className='text-primary font-bold text-sm'>ACES - KNUST</p>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                </div>
                <h1 className='text-3xl font-bold font-header'>Association of Computer Engineering Students - ACES KNUST</h1>
                <div className='w-16 h-1.5 bg-primary rounded-full'></div>
                <p className='text-lg font-header'>The Association of Computer Engineering Students (ACES) is the official student body representing all Computer Engineering students at KNUST. As a vibrant community of innovative and forward-thinking individuals, ACES serves as a platform for students to connect, learn, and grow together in the field of Computer Engineering.
                  Our association is committed to supporting students through a wide range of initiatives, including technical workshops, career development programs, mentorship, industrial visits, networking events, and community service. We organize events, competitions, conferences, and strive to bridge the gap between classroom learning and real-world application.
                  At the heart of ACES is a passion for technology and a drive to solve problems that impact our society. Whether it's through projects, hackathons, or leadership opportunities, we provide opportunities to think critically, work ethically, and lead confidently in the tech space.
                  Together, we aim to build a vibrant community where innovation thrives, ideas are shared, and every member is empowered to succeed.</p>
                <button className='bg-primary text-white px-6 py-3 cursor-pointer rounded-full w-max font-semibold'>See Website</button>
              </div>
            </TabsContent>
            <TabsContent value="mission" className='py-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-2'>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                  <p className='text-primary font-bold text-sm'>ACES - KNUST</p>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                </div>
                <h1 className='text-3xl font-bold font-header'>Mission</h1>
                <div className='w-16 h-1.5 bg-primary rounded-full'></div>
                <p className='text-lg font-header'>The Association of Computer Engineering Students (ACES) is the official student body representing all Computer Engineering students at KNUST. As a vibrant community of innovative and forward-thinking individuals, ACES serves as a platform for students to connect, learn, and grow together in the field of Computer Engineering.
                  Our association is committed to supporting students through a wide range of initiatives, including technical workshops, career development programs, mentorship, industrial visits, networking events, and community service. We organize events, competitions, conferences, and strive to bridge the gap between classroom learning and real-world application.
                  At the heart of ACES is a passion for technology and a drive to solve problems that impact our society. Whether it's through projects, hackathons, or leadership opportunities, we provide opportunities to think critically, work ethically, and lead confidently in the tech space.
                  Together, we aim to build a vibrant community where innovation thrives, ideas are shared, and every member is empowered to succeed.</p>
                <button className='bg-primary text-white px-6 py-3 cursor-pointer rounded-full w-max font-semibold'>See Website</button>
              </div>
            </TabsContent>
            <TabsContent value="vision" className='py-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex items-center gap-2'>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                  <p className='text-primary font-bold text-sm'>ACES - KNUST</p>
                  <Image src={star} alt="star" width={12} height={12} className='w-3 h-3' />
                </div>
                <h1 className='text-3xl font-bold font-header'>Vision</h1>
                <div className='w-16 h-1.5 bg-primary rounded-full'></div>
                <p className='text-lg font-header'>The Association of Computer Engineering Students (ACES) is the official student body representing all Computer Engineering students at KNUST. As a vibrant community of innovative and forward-thinking individuals, ACES serves as a platform for students to connect, learn, and grow together in the field of Computer Engineering.
                  Our association is committed to supporting students through a wide range of initiatives, including technical workshops, career development programs, mentorship, industrial visits, networking events, and community service. We organize events, competitions, conferences, and strive to bridge the gap between classroom learning and real-world application.
                  At the heart of ACES is a passion for technology and a drive to solve problems that impact our society. Whether it's through projects, hackathons, or leadership opportunities, we provide opportunities to think critically, work ethically, and lead confidently in the tech space.
                  Together, we aim to build a vibrant community where innovation thrives, ideas are shared, and every member is empowered to succeed.</p>
                <button className='bg-primary text-white px-6 py-3 cursor-pointer rounded-full w-max font-semibold'>See Website</button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>

    </div>
  )
}

export default page