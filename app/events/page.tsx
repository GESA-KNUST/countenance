'use client';
import HeroSection from '../../components/events/HeroSection';
import RecentEvents from '../../components/events/RecentEvents';
import AllEvents from '../../components/events/AllEvents';
import useEventCollection from '../../hooks/useEventCollection';

const EventsPage = () => {
  const { data: events } = useEventCollection();

  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        images={['/images/event/event-1.jpg', '/images/event/event-5.jpg', '/images/event/event-4.JPG']}
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
