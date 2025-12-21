'use client';
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import useEventCollection from "@/hooks/useEventCollection";
import FetchError from "../custom/FetchError";

const RecentEvent = () => {
  const { data: events, isLoading, error } = useEventCollection();

  const now = new Date();

  const upcoming = events
    ?.filter((event) => new Date(event.eventDate) > now)
    ?.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    )
    .slice(0, 3); // Limit to 3 upcoming for cleaner UI

  const recent = events
    ?.filter((event) => new Date(event.eventDate) <= now)
    ?.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    )
    .slice(0, 3); // Limit to 3 recent

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center text-muted-foreground animate-pulse">Loading events...</div>
  }

  if (error) {
    return <FetchError />
  }

  return (
    <section className="px-page-sx md:px-page-x lg:py-16 py-12 font-header bg-background/50 overflow-hidden relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/coenight.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_auto_1fr] gap-12 relative z-20">

        {/* Upcoming Events Column */}
        <div className="flex flex-col gap-8">
          <h2 className="font-header font-bold text-3xl text-white">
            Upcoming Events
          </h2>

          <div className="flex flex-col gap-4">
            {upcoming && upcoming.length > 0 ? (
              upcoming.map((event) => (
                <Link href={`/events#event-${event.slug}`} key={event._id} className="group block w-full">
                  <div className="flex items-center gap-4 p-3 pr-4 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-accent/50 rounded-xl border-2 border-transparent hover:border-border transition-all duration-300 group-hover:scale-[1.02]">
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {format(new Date(event.eventDate), "MMM")}
                      </span>
                      <span className="text-xl font-bold font-open_sans leading-none">
                        {format(new Date(event.eventDate), "d")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors font-header">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        <span className="whitespace-pre-wrap">{event.description}</span>
                      </p>
                    </div>

                    <div className="text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
                No upcoming events. Stay tuned!
              </div>
            )}
          </div>

          {/* Subtle decoration or Call to action card could go here */}
          <div className="mt-4 p-6 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/30"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1 font-header">Join the Community</h3>
              <p className="text-gray-300 text-sm mb-4">Don't miss out on future events and opportunities.</p>
              <Link href="/events" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors gap-2">
                View Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden lg:flex justify-center">
          <div className="w-px h-full bg-linear-to-b from-transparent via-border to-transparent"></div>
        </div>

        {/* Recent Events Column */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-header font-bold text-3xl text-white flex items-center gap-2">
              Recent Events
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {recent && recent.length > 0 ? (
              recent.map((event) => (
                <Link href={`/events#event-${event.slug}`} key={event._id} className="group block">
                  <div className="bg-[#ffffff]/95 dark:bg-card border-2 border-border/40 hover:border-primary/50 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col sm:flex-row h-auto sm:h-[180px] p-2 sm:p-0 gap-4 group-hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative w-full sm:w-[200px] h-[160px] sm:h-full overflow-hidden rounded-xl sm:rounded-none sm:rounded-l-xl">
                      <Image
                        src={event.eventImage.url}
                        alt="Event Image"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between py-4 pr-6 flex-1 gap-2 sm:gap-0">
                      <div>
                        <div className="flex items-center gap-2 text-primary font-header font-semibold text-xs uppercase tracking-wider mb-2">
                          <Clock className="w-3 h-3" />
                          completed
                        </div>
                        <h3 className="font-header font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          {format(new Date(event.eventDate), "MMM do, yyyy")}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-white bg-gray-50 rounded-xl border border-dashed">
                No recent events found.
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default RecentEvent;
