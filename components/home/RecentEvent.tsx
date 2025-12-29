'use client';
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import useEventCollection from "@/hooks/useEventCollection";
import FetchError from "../custom/FetchError";

import { motion } from "framer-motion";

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
    <section className="px-page-sx md:px-page-x lg:py-24 py-16 font-header bg-background/50 overflow-hidden relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/coenight.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_auto_1fr] gap-12 relative z-20">

        {/* Upcoming Events Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-8"
        >
          <h2 className="font-header font-bold text-4xl text-white">
            Upcoming Events
          </h2>

          <div className="flex flex-col gap-4">
            {upcoming && upcoming.length > 0 ? (
              upcoming.map((event) => (
                <Link href={`/events#event-${event.slug}`} key={event._id} className="group block w-full">
                  <div className="flex items-center gap-4 p-4 pr-5 bg-white/95 backdrop-blur-sm dark:bg-card hover:bg-white dark:hover:bg-accent/50 rounded-2xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 group-hover:scale-[1.02] shadow-sm">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {format(new Date(event.eventDate), "MMM")}
                      </span>
                      <span className="text-2xl font-bold font-open_sans leading-none">
                        {format(new Date(event.eventDate), "d")}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors font-header text-lg">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
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
              <div className="p-8 text-center text-white/70 bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/20">
                No upcoming events. Stay tuned!
              </div>
            )}
          </div>

          <div className="mt-4 p-8 bg-linear-to-br from-gray-900 to-black rounded-3xl text-white relative overflow-hidden group border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-primary/30"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2 font-header">Join the Community</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Don't miss out on future events and opportunities from the biggest engineering body on campus.</p>
              <Link href="/events" className="inline-flex items-center text-sm font-bold text-primary hover:text-white transition-colors gap-2 group-link">
                View All Events <ArrowRight className="w-4 h-4 group-link-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Separator */}
        <div className="hidden lg:flex justify-center h-full">
          <div className="w-px h-full bg-linear-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Recent Events Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-header font-bold text-4xl text-white flex items-center gap-3">
              Recent Events
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse font-header" />
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {recent && recent.length > 0 ? (
              recent.map((event) => (
                <Link href={`/events#event-${event.slug}`} key={event._id} className="group block">
                  <div className="bg-white/95 backdrop-blur-sm dark:bg-card border-2 border-transparent hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col sm:flex-row h-auto sm:h-[180px] p-2 sm:p-0 gap-4 group-hover:-translate-y-1">
                    <div className="relative w-full sm:w-[220px] h-[160px] sm:h-full overflow-hidden rounded-2xl sm:rounded-none">
                      <Image
                        src={event.eventImage.url}
                        alt="Event Image"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>

                    <div className="flex flex-col justify-between py-5 pr-7 flex-1 gap-2 sm:gap-0">
                      <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-2">
                          <Clock className="w-3 h-3" />
                          completed
                        </div>
                        <h3 className="font-header font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wide">
                          <CalendarDays className="w-4 h-4" />
                          {format(new Date(event.eventDate), "MMM do, yyyy")}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-sm">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-white/70 bg-white/5 backdrop-blur-sm rounded-2xl border border-dashed border-white/20">
                No recent events found.
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default RecentEvent;
