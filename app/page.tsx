import Personality from '../components/home/Personality';
import HeroSection from '../components/home/HeroSection'
import React from 'react'
import RecentEvent from '../components/home/RecentEvent';
import Gallery from '../components/home/Gallery';
import HistorySection from '../components/home/HistorySection';
import HomeHubsPreview from '../components/home/HomeHubsPreview';
import HomeClubsPreview from '../components/home/HomeClubsPreview';
import HomeBlogPreview from '../components/home/HomeBlogPreview';
import Contribute from '@/components/home/Contribute';

const Home = () => {
  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        title="Engineering Beyond Classrooms"
        highlight="Engineering"
        text="Empowering students with cutting-edge knowledge, hands-on experience, and the tools to shape the future of technology and innovation."
        images={['/images/img1.png', '/images/img2.png', '/images/img1.png', '/images/img2.png']}
      />
      <Personality />
      <HistorySection />
      <HomeHubsPreview />
      <HomeClubsPreview />
      <RecentEvent />
      <Contribute />
      {/* <HomeBlogPreview /> */}
      <Gallery />
    </div>
  )
}

export default Home;