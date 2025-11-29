'use client';
import Autoplay from "embla-carousel-autoplay";
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import EventCard from './EventsCard';
import SkeletonLoadingCard from './SkeletonLoadingCard'; 
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";

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
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  items: ItemsProps[];
  isLoading?: boolean; 
}

const HeroSection: React.FC<HeroSectionProps> = ({
  images,
  title,
  subtitle,
  currentIndex,
  total,
  onNext,
  onPrev,
  items,
  isLoading = false,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  useEffect(() => {
    if (!api) return;
  }, [api]);

  const MOBILE_CARD_HEIGHT = 260;

  return (
    <div className="relative h-[calc(100vh-var(--navbar-height))] w-full flex items-center justify-center">
      
      
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
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-semibold leading-tight">
            {title} <span className="text-[#FFBE00]">Events</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col items-center lg:items-start gap-4">
            <button className="bg-[#FFBE00] text-black px-5 py-3 rounded-lg font-semibold flex items-center gap-2 text-sm sm:text-base">
              <span>Explore more</span>
              <ArrowUpRight className="h-5 w-5" />
            </button>

           
            <div className="hidden lg:flex items-center gap-4 mt-8 text-white">
              <button onClick={onPrev} className="p-3 border border-white/30 rounded-full">
                <ChevronLeft />
              </button>
              <span>{currentIndex + 1}/{total}</span>
              <button onClick={onNext} className="p-3 border border-white rounded-full">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        
        <div className="hidden lg:block w-[800px] overflow-hidden">
          {isLoading ? (
            <SkeletonLoadingCard />
          ) : (
            <div
              className="flex gap-6 items-center transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (334 + 24)}px)` }}
            >
              {items?.map((item, index) => {
                let opacityClass = 'opacity-25';
                if (index === currentIndex) opacityClass = 'opacity-100';
                else if (index === currentIndex + 1) opacityClass = 'opacity-50';

                return (
                  <div
                    key={item._id}
                    className={`w-[334px] shrink-0 transition-opacity duration-300 ${opacityClass}`}
                  >
                    <EventCard
                      title={item.title}
                      description={item.description}
                      headerImg={item.eventImage}
                      date={item.eventDate}
                      venue={item.venue}
                      onlineLink={item.onlineLink}
                      slug={item.slug}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

       
        <div className="lg:hidden w-full max-w-sm mx-auto mt-4">
          {isLoading ? (
            <SkeletonLoadingCard />
          ) : (
            <>
              <div className="relative overflow-hidden" style={{ height: MOBILE_CARD_HEIGHT }}>
                <div
                  className="absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentIndex * MOBILE_CARD_HEIGHT}px)` }}
                >
                  {items?.map((item) => (
                    <a key={item._id} href={`#event-${item.slug}`} className="block w-full">
                      <div className="relative w-full h-[260px] rounded-xl overflow-hidden shadow-lg">
                        <Image src={item.eventImage.url} alt={item.title} fill className="object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                          <p className="text-white font-semibold text-lg leading-tight line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-2 text-white">
                <button onClick={onPrev} className="p-3 border border-white/30 rounded-full">
                  <ChevronUp />
                </button>
                <span>{currentIndex + 1}/{total}</span>
                <button onClick={onNext} className="p-3 border border-white rounded-full">
                  <ChevronDown />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
