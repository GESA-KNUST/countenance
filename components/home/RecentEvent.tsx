"use client";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import arrowRight from "../../public/images/arrowRight.svg";
import useEventCollection from "@/hooks/useEventCollection";

const RecentEvent = () => {
  const { data: events, isLoading } = useEventCollection();

  const now = new Date();

  const upcoming = events
    ?.filter((event) => new Date(event.eventDate) > now)
    ?.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  const recent = events
    ?.filter((event) => new Date(event.eventDate) <= now)
    ?.sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );

  return (
    <section className="md:px-page-x lg:py-page-y px-page-sx font-poppins my-16">
      <div className="max-w-360 mx-auto flex gap-12 flex-col lg:flex-row">
        {/* Recent Events */}
        <div className="flex flex-col gap-8 flex-1">
          <h2 className="font-open_sans font-bold text-3xl">Recent Events</h2>
          <div className="flex flex-col gap-8">
            {recent?.length > 0 ? (
              recent.map((event, i) => (
                <Link href={`/events/${event.slug}`} key={event._id} className="group">
                  <div
                    className="flex md:gap-6 gap-3 cursor-pointer rounded-md transition-all duration-500 h-[170px]"
                  >
                    <div className="overflow-hidden rounded-xl relative h-full w-[188px] flex-shrink-0">
                      <Image
                        src={event.eventImage.url}
                        alt="eventimg"
                        className="object-cover rounded-md transition-all group-hover:scale-105"
                        fill
                      />
                    </div>
                    <div className="flex flex-col justify-between font-open_sans w-full">
                      <div className="space-y-1">
                        <h3 className="font-bold sm:text-lg text-base line-clamp-2 group-hover:underline">
                          {event.slug}
                        </h3>
                        <p className="text-medium-dark md:text-sm text-xs line-clamp-3">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:text-sm text-xs">
                        <span className="text-gray-500">
                          {format(new Date(event.eventDate), "do MMMM, yyyy")}
                        </span>
                        <Image src={arrowRight} alt="arrow" className="group-hover:translate-x-1 transition-all"/>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No recent events.</p>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <Separator orientation="vertical" className="h-full bg-separator" />
        </div>

        {/* Upcoming Events */}
        <div className="flex flex-col gap-8 flex-1">
          <h2 className="font-bold text-3xl font-open_sans">Upcoming Events</h2>

          <div className="flex flex-col sm:gap-6 gap-4">
            {upcoming?.length > 0 ? (
              upcoming.map((event, i) => (
                <Link href={`/events/${event.slug}`} key={event._id} className="group">
                  <div
                    className="flex gap-4 bg-white/70 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all duration-500 h-24"
                  >
                    <div className="relative w-12 h-full">
                      <Image
                        src={event.eventImage.url}
                        alt={event.eventImage.description}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {format(new Date(event.eventDate), "do MMMM, yyyy")}
                        </span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:underline">{event.slug}</h3>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentEvent;
