import HeroSection from '@/components/home/HeroSection'
import ClubsList from '@/components/clubs/ClubsList';
import { getClubsSafe } from '@/lib/data/club';

const ClubsPage = async () => {
  const clubs = await getClubsSafe();

  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        title="Explore Our Clubs and Societies"
        highlight="Clubs and Societies"
        text='Connect, learn, and grow with clubs and societies that support your passions, goals, and personal development.'
        images={['/images/clubs/clubs-1.webp', '/images/clubs/clubs-2.webp', '/images/clubs/clubs-3.webp']}
        button={false}
      />
      <ClubsList clubs={clubs} />
    </div>
  )
}

export default ClubsPage;
