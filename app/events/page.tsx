'use client';
import HeroSection from '../../components/events/HeroSection';
import RecentEvents from '../../components/events/RecentEvents';
import AllEvents from '../../components/events/AllEvents';
import useEventCollection from '../../hooks/useEventCollection';

const EventsPage = () => {
  const { data: events, isLoading, error } = useEventCollection();

  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        images={["/images/img1.png", "/images/img2.png", "/images/img1.png", "/images/img2.png"]}
        title="Upcoming"
        subtitle="Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community."
        items={events ?? []}  
      />

      <div id="recent-events">
        <RecentEvents
          events={events ?? []} 
        />
      </div>

      <AllEvents />
    </div>
  );
};

export default EventsPage;
