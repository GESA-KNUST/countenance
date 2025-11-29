'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import EventCard from './EventsCard';
import useEventCollection from '../../hooks/useEventCollection';

const AllEvents = () => {
  const { data: events, isLoading, error } = useEventCollection();
  const [searchTerm, setSearchTerm] = useState('');
 
  const items = events ?? [];

  const filteredEvents = items.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 flex flex-col lg:flex-row items-start gap-12 scroll-smooth">
      <div className="w-full lg:w-1/3 xl:w-1/4">
        <div className="text-center xl:text-left">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight">
            All <br /> <span className="text-[#FFBE00]">Events</span>
          </h2>
          <p className="mt-8 text-lg sm:text-xl text-gray-700 mx-auto xl:mx-0">
            Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community.
          </p>

          <div className="mt-10 mx-auto xl:mx-0">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <input
                type="text"
                placeholder="Search Event"
                className="text-lg sm:text-xl outline-none w-full bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 xl:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading && (
          <div className="col-span-full p-4 text-center">Loading events…</div>
        )}

        {error && (
          <div className="col-span-full p-4 text-center text-red-600">
            Error loading events.
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="col-span-full p-4 text-center">No events found.</div>
        )}

        {!isLoading && !error &&
          filteredEvents.map((event) => (
            <div
              key={event._id}
              id={`event-${event.slug}`}   
              className="scroll-mt-28"     
            >
              <EventCard
                title={event.title}
                description={event.description}
                date={event.eventDate}
                headerImg={event.eventImage}
                venue={event.venue}
                onlineLink={event.onlineLink}
                slug={event.slug}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllEvents;
