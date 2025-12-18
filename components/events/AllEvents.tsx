"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import EventCard from "./EventsCard";
import SkeletonLoadingCard from "./SkeletonLoadingCard";
import useEventCollection from "../../hooks/useEventCollection";

const AllEvents = () => {
  const { data: events, isLoading, error } = useEventCollection();
  const [searchTerm, setSearchTerm] = useState("");

  const items = events ?? [];

  const filteredEvents = items.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 flex flex-col lg:flex-row items-start gap-12 scroll-smooth">

      
      <div className="w-full lg:w-1/4 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
          All <br className="hidden lg:block"/> <span className="text-[#FFBE00]">Events</span>
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

      
      <div className="
        w-full lg:w-3/4
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3
        gap-8
        items-stretch
        content-start
      ">
        
        {isLoading && <SkeletonLoadingCard />}

        {error && (
          <div className="col-span-full p-4 text-center text-red-600">
            Error loading events.
          </div>
        )}

        {!isLoading && !error && filteredEvents.length === 0 && (
          <div className="col-span-full p-4 text-center">No events found.</div>
        )}

        {!isLoading &&
          !error &&
          filteredEvents.map((event) => (
            <div
              key={event._id}
              id={`event-${event.slug}`}
              className="h-full flex"
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
