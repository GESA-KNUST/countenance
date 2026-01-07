'use client';
import Autoplay from "embla-carousel-autoplay";
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Hand } from 'lucide-react';
import EventCard from './EventsCard';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import { motion } from "framer-motion";
import EmptyState from './EmptyState';

interface ItemsProps {
  _id: string;
  slug: string;
  title: string;
  description: string;
  eventImage: {
    url: string;
    description: string;
  };
  eventDate: string;
  venue: {
    lat: number;
    lon: number;
  };
  onlineLink?: string;
}

interface HeroSectionProps {
  images: (string | StaticImageData)[];
  title: string;
  subtitle: string;
  items: ItemsProps[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  images,
  title,
  subtitle,
  items,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const MOBILE_CARD_HEIGHT = 460;
  const total = items?.length || 0;

  const scrollToEvent = (slug: string) => {
    const element = document.getElementById(`event-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextClick = () => {
    if (!items || items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrevClick = () => {
    if (!items || items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  const handleExploreMore = () => {
    const recentEventsSection = document.getElementById("recent-events");
    if (recentEventsSection) {
      recentEventsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height))] w-full flex items-center justify-center overflow-auto">

      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full h-full absolute inset-0"
        opts={{ loop: true, duration: 50 }}
      >
        <CarouselContent className="h-full ml-0">
          {images.map((img, index) => (
            <CarouselItem
              key={index}
              className="relative h-[calc(100vh-var(--navbar-height))] w-full pl-0"
            >
              <Image
                src={img}
                alt={`Hero image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 w-full flex flex-col lg:flex-row items-center justify-between text-white p-4 sm:p-8 md:p-12 lg:p-20 xl:p-24 gap-6">

        <div className="max-w-xl text-center lg:text-left">
          <h1 className='font-bold font-header text-4xl leading-12 sm:text-[60px] sm:leading-16 md:text-[72px] md:leading-[76px] xl:text-[90px] lg:leading-[90px]'>
            {title} <span className="text-[#FFBE00] font-header">Events</span>
          </h1>
          <p className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'>
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col items-center lg:items-start gap-4">
            <button onClick={handleExploreMore} className="bg-[#FFBE00] text-black px-5 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm sm:text-base">
              <span>Explore more</span>
              <ArrowUpRight className="h-5 w-5" />
            </button>

            {total > 0 && (
              <div className="hidden lg:flex items-center gap-4 mt-8 text-white">
                <button onClick={handlePrevClick} className="p-3 border border-white/30 rounded-full">
                  <ChevronLeft />
                </button>
                <span>{currentIndex + 1}/{total}</span>
                <button onClick={handleNextClick} className="p-3 border border-white rounded-full">
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>

        {total > 0 ? (
          <>
            <div className="hidden lg:block w-[800px] overflow-hidden">
              <div
                className="flex gap-6 items-stretch transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (334 + 24)}px)` }}
              >
                {items?.map((item, index) => (
                  <div
                    key={item._id}
                    onClick={() => scrollToEvent(item.slug)}
                    className={`w-[334px] shrink-0 cursor-pointer transition-opacity duration-300 flex flex-col ${index === currentIndex
                      ? 'opacity-100'
                      : index === currentIndex + 1
                        ? 'opacity-50'
                        : 'opacity-25'
                      }`}
                  >
                    <EventCard
                      isHeroCard={true}
                      title={item.title}
                      description={item.description}
                      headerImg={item.eventImage}
                      date={item.eventDate}
                      venue={item.venue}
                      onlineLink={item.onlineLink}
                      slug={item.slug}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden w-full max-w-sm mx-auto mt-4">
              <Carousel
                className="w-full"
                setApi={setMobileApi}
                plugins={[]}
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="-ml-4">
                  {items?.map((item) => (
                    <CarouselItem key={item._id} className="pl-4 basis-full">
                      <div
                        onClick={() => scrollToEvent(item.slug)}
                        className="h-full"
                      >
                        <EventCard
                          isHeroCard={true}
                          title={item.title}
                          description={item.description}
                          headerImg={item.eventImage}
                          date={item.eventDate}
                          venue={item.venue}
                          onlineLink={item.onlineLink}
                          slug={item.slug}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-4 text-white/50">
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Hand className="w-5 h-5" />
                  </motion.div>
                  <span className="text-xs font-medium tracking-wide">Swipe to explore</span>
                </div>
              </Carousel>
            </div>
          </>
        ) : (
          <div className="w-full lg:w-1/2">
            <EmptyState
              title="No Upcoming Events"
              message="We're currently planning some amazing events. Stay tuned and check back soon."
              isHero={true}
              showHomeButton={false}
            />
          </div>
        )}

      </div>

      {/* Progressive Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              onClick={() => handleDotClick(index)}
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${current === index ? 'bg-white' : 'bg-white/30'} rounded-full cursor-pointer transition-all duration-300 hover:bg-white/60`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
