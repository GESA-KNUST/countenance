import Personality from '../components/home/Personality';
import ProvostSection from '../components/home/ProvostSection';
import HeroSection from '../components/home/HeroSection'
import RecentEvent from '../components/home/RecentEvent';
import Gallery from '../components/home/Gallery';
import HistorySection from '../components/home/HistorySection';
import HomeHubsPreview from '../components/home/HomeHubsPreview';
import HomeClubsPreview from '../components/home/HomeClubsPreview';
import Contribute from '@/components/home/Contribute';
import { getPageHero } from '@/lib/data/page-hero';
import { getPersonalityOfTheWeek } from '@/lib/data/potw';

const Home = async () => {
  const [hero, potw] = await Promise.all([getPageHero('home'), getPersonalityOfTheWeek()]);

  return (
    <div className='font-poppins min-h-screen overflow-x-hidden w-full'>
      <HeroSection
        title="Engineering Beyond Classrooms"
        highlight="Engineering"
        text="Empowering students with cutting-edge knowledge, hands-on experience, and the tools to shape the future of technology and innovation."
        images={hero.images}
        mobileImages={hero.mobileImages.length > 0 ? hero.mobileImages : undefined}
        buttonTarget="personality-of-the-week"
        isScroll={true}
      />
      <Personality initial={potw} />
      <ProvostSection />
      <HistorySection />
      <HomeHubsPreview />
      <HomeClubsPreview />
      <RecentEvent />
      <Contribute />
      <Gallery />
    </div>
  )
}

export default Home;