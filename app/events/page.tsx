import HeroSection from '../../components/events/HeroSection';
import RecentEvents from '../../components/events/RecentEvents';
import AllEvents from '../../components/events/AllEvents';
import { getEventsSafe } from '@/lib/data/event';
import { eventListSchema } from '@/lib/seo/event-schema';

const EventsPage = async () => {
  const events = await getEventsSafe();

  return (
    <div className='font-poppins min-h-screen'>
      {events.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventListSchema(events)) }}
        />
      )}

      <HeroSection
        images={['/images/event/event-1.jpg', '/images/event/event-5.webp', '/images/event/event-4.webp']}
        title="Upcoming"
        subtitle="Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community."
        items={events}
      />

      <div id="recent-events">
        <RecentEvents
          events={events}
        />
      </div>

      <AllEvents initialEvents={events} />
    </div>
  );
};

export default EventsPage;
