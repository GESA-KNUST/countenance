'use client';
import EventCard from './EventsCard';
import SkeletonLoadingCard from './SkeletonLoadingCard';
import React from 'react';
import EmptyState from './EmptyState';

interface EventVenue {
  lat: number;
  lon: number;
}

interface EventImage {
  url: string;
  description: string;
}

interface EventItem {
  _id: string;
  slug: string;
  title: string;
  description: string;
  eventDate: string;
  venue: EventVenue;
  onlineLink?: string;
  eventImage: EventImage;
}

interface RecentEventsProps {
  events?: EventItem[];
  isLoading?: boolean;
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events = [], isLoading = false }) => {
  const DISPLAY_COUNT = 3;
  const now = new Date();


  const pastEvents = events.filter((event) => new Date(event.eventDate) <= now);


  const sortedEvents = pastEvents.sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  const eventsToRender = sortedEvents.slice(0, DISPLAY_COUNT);

  return (
    <div className="py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 flex flex-col lg:flex-row items-start gap-12">
      <div className="w-full lg:w-1/4 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight font-header">
          Recent <br className="hidden lg:block" /> <span className="text-[#FFBE00] font-header">Events</span>
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-700">
          Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community.
        </p>
      </div>


      <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        {isLoading ? (

          <SkeletonLoadingCard />
        ) : eventsToRender.length > 0 ? (
          eventsToRender.map((event) => (
            <EventCard
              key={event._id}
              title={event.title}
              description={event.description}
              date={event.eventDate}
              headerImg={event.eventImage}
              venue={event.venue}
              onlineLink={event.onlineLink}
              slug={event.slug}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="The Spotlight is Resting"
              message="Our past events were legendary, but we've cleared the stage for the next wave of innovation. Check back soon to see what we've been up to"
              showHomeButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentEvents;
