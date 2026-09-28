'use client';
import Image from "next/image";
import { ctfSrc } from '@/lib/contentful-src';
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import useEventCollection from "@/hooks/useEventCollection";
import FetchError from "../custom/FetchError";

import * as Tabs from "@radix-ui/react-tabs";

const RecentEvent = () => {
  const { data: events, isLoading, error } = useEventCollection();

  const now = new Date();

  const upcoming = events
    ?.filter((event) => new Date(event.eventDate) > now)
    ?.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    )
    .slice(0, 3);

  const recent = events
    ?.filter((event) => new Date(event.eventDate) <= now)
    ?.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    )
    .slice(0, 3);

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading events...</div>
  }

  if (error) {
    return <FetchError />
  }

  return (
    <section className="px-4 sm:px-page-sx md:px-page-x py-12 lg:py-24 font-header bg-background/50 overflow-hidden relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/coenight.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Mobile Tabs View */}
        <div className="lg:hidden">
          <Tabs.Root defaultValue="upcoming" className="flex flex-col gap-8">
            <Tabs.List className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
              <Tabs.Trigger
                value="upcoming"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-black text-white/70 hover:text-white"
              >
                Upcoming
              </Tabs.Trigger>
              <Tabs.Trigger
                value="recent"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-black text-white/70 hover:text-white"
              >
                Recent
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="upcoming" className="outline-none">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {upcoming && upcoming.length > 0 ? (
                    upcoming.map((event) => (
                      <EventCard key={event._id} event={event} type="upcoming" />
                    ))
                  ) : (
                    <EmptyEvents message="No upcoming events. Stay tuned!" />
                  )}
                </div>
                <JoinCommunityCard />
              </div>
            </Tabs.Content>

            <Tabs.Content value="recent" className="outline-none">
              <div className="flex flex-col gap-4">
                {recent && recent.length > 0 ? (
                  recent.map((event) => (
                    <EventCard key={event._id} event={event} type="recent" />
                  ))
                ) : (
                  <EmptyEvents message="No recent events found." />
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-[1.2fr_auto_1fr] gap-12">
          {/* Upcoming Events Column */}
          <div className="flex flex-col gap-8">
            <h3 className="font-header font-bold text-4xl text-white">
              Upcoming Events
            </h3>

            <div className="flex flex-col gap-4">
              {upcoming && upcoming.length > 0 ? (
                upcoming.map((event) => (
                  <EventCard key={event._id} event={event} type="upcoming" />
                ))
              ) : (
                <EmptyEvents message="No upcoming events. Stay tuned!" />
              )}
            </div>

            <JoinCommunityCard />
          </div>

          {/* Separator */}
          <div className="flex justify-center h-full">
            <div className="w-px h-full bg-linear-to-b from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Recent Events Column */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-header font-bold text-4xl text-white flex items-center gap-3">
                Recent Events
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse font-header" />
              </h3>
            </div>

            <div className="flex flex-col gap-6">
              {recent && recent.length > 0 ? (
                recent.map((event) => (
                  <EventCard key={event._id} event={event} type="recent" />
                ))
              ) : (
                <EmptyEvents message="No recent events found." />
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

const EventCard = ({ event, type }: { event: any; type: 'upcoming' | 'recent' }) => {
  if (type === 'upcoming') {
    return (
      <Link href={`/events#event-${event.slug}`} className="group block w-full">
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/95 backdrop-blur-sm dark:bg-card hover:bg-white dark:hover:bg-accent/50 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] shadow-sm">
          <div className="flex flex-col items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider">
              {format(new Date(event.eventDate), "MMM")}
            </span>
            <span className="text-xl lg:text-2xl font-bold font-open_sans leading-none">
              {format(new Date(event.eventDate), "d")}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors font-header text-base sm:text-lg">
              {event.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              <span className="whitespace-pre-wrap">{event.description}</span>
            </p>
          </div>

          <div className="text-muted-foreground shrink-0 group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events#event-${event.slug}`} className="group block w-full">
      <div className="bg-white/95 backdrop-blur-sm dark:bg-card border-2 border-transparent hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-row items-stretch gap-3 sm:gap-4 p-3 group-hover:-translate-y-1">
        <div className="relative shrink-0 w-20 sm:w-28 lg:w-24 xl:w-32 aspect-square rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={ctfSrc(event.eventImage.url, 256)}
            alt=""
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 128px"
              unoptimized
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase tracking-widest">
            <Clock className="w-3 h-3 shrink-0" />
            completed
          </div>

          <h3 className="font-header font-bold text-sm sm:text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {event.title}
          </h3>

          <p className="text-gray-500 text-[11px] sm:text-sm line-clamp-2 leading-snug">
            {event.description}
          </p>

          <div className="flex items-center justify-between gap-2 mt-auto pt-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wide min-w-0 truncate">
              <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              {format(new Date(event.eventDate), "MMM do, yyyy")}
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const JoinCommunityCard = () => (
  <div className="mt-4 p-5 lg:p-8 bg-linear-to-br from-gray-900 to-black rounded-3xl text-white relative overflow-hidden group border border-white/10 shadow-2xl">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/30"></div>
    <div className="relative z-10">
      <h3 className="font-bold text-xl lg:text-2xl mb-2 font-header">Join the Community</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">Don&apos;t miss out on future events and opportunities from the biggest engineering body on campus.</p>
      <Link href="/events" className="group/link inline-flex items-center text-sm font-bold text-primary hover:text-white transition-colors gap-2">
        View All Events <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
      </Link>
    </div>
  </div>
);

const EmptyEvents = ({ message }: { message: string }) => (
  <div className="p-8 text-center text-white/70 bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/20">
    {message}
  </div>
);

export default RecentEvent;
