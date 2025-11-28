'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventsCard';

const RecentEvents = ({ currentIndex, total, onNext, onPrev, events }) => {
  const getEventAtIndex = (index) => events[index % events.length];

  return (
    <div className="py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 flex flex-col lg:flex-row items-start gap-12">
      <div className="w-full lg:w-1/3 xl:w-1/4 text-center lg:text-left">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight">
          Recent <br /> <span className="text-[#FFBE00]">Events</span>
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-700">
          Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community.
        </p>

        <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
          <button onClick={onPrev} className="p-3 border border-black/30 rounded-full">
            <ChevronLeft />
          </button>
          <span>{currentIndex + 1}/{total}</span>
          <button onClick={onNext} className="p-3 border border-black rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

  <div className="w-full lg:w-2/3 xl:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {events && events.length > 0 && [...Array(3)].map((_, i) => {
          const event = getEventAtIndex(currentIndex + i);
          return <EventCard 
            key={event._id} 
            title={event.title} 
            description={event.description}
            date={event.eventDate}
            headerImg={event.eventImage}
            venue={event.venue}
            onlineLink={event.onlineLink}
            slug={event.slug}
          />;
        })}
      </div>
    </div>
  );
};

export default RecentEvents;
