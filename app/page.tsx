import Personality from '../components/home/Personality';
import HeroSection from '../components/home/HeroSection'
import React from 'react'
import RecentEvent from '../components/home/RecentEvent';
import Gallery from '../components/home/Gallery';

const Home = () => {
  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection/>
      <Personality/>
      <RecentEvent/>
      <Gallery/>
    </div>
  )
}

export default Home;