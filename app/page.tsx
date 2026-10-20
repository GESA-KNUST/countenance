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
import { getEventsSafe } from '@/lib/data/event';
import { getClubsSafe } from '@/lib/data/club';
import { getHubsSafe } from '@/lib/data/hub';
import { getGalleriesSafe } from '@/lib/data/gallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const Home = async () => {
  const [hero, potw, events, clubs, hubs, galleries] = await Promise.all([
    getPageHero('home'),
    getPersonalityOfTheWeek(),
    getEventsSafe(),
    getClubsSafe(),
    getHubsSafe(),
    getGalleriesSafe(),
  ]);

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
        variant="band"
      />
      <Personality initial={potw} />
      <ProvostSection />
      <HistorySection />
      <HomeHubsPreview initialHubs={hubs} />
      <HomeClubsPreview initialClubs={clubs} />
      <RecentEvent initialEvents={events} />
      <Contribute />
      <Gallery initialGalleries={galleries} />
    </div>
  )
}

export default Home;