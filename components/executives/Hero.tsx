'use client';
import Autoplay from "embla-carousel-autoplay"
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

interface HeroProps {
  images?: (string | StaticImageData)[];
}

const Hero = ({
  images: initialImages,
}: HeroProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const desktopImages = [
    '/images/executive/executivehero-1.jpg',
    '/images/executive/executivehero-2.jpg',
    '/images/executive/executivehero-3.png'
  ];

  const mobileImages = [
    '/images/executive/executiveimage-1.png',
    '/images/executive/executiveimage-2.png',
    '/images/executive/executiveimage-3.jpg'
  ];

  const images = initialImages || (isMobile ? mobileImages : desktopImages);

  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

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

  return (
    <div className='relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden bg-neutral-950'>

      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full h-full absolute inset-0"
        opts={{
          loop: true,
          duration: 50,
        }}
      >
        <CarouselContent className="h-full">
          {images.map((img, index) => (
            <CarouselItem key={index} className="relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full">
              <Image
                src={img}
                alt={`Hero image ${index + 1}`}
                fill
                className='object-cover'
                priority={index === 0}
                sizes="100vw"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>


      <div className='absolute inset-0 bg-black/40 z-10' />


      <div className="relative z-20 flex flex-col justify-center items-center text-center md:items-start md:text-left h-full text-white p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl">
          <div className="flex flex-col gap-1 sm:gap-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-tight sm:leading-none font-header">
              Our <br className="hidden sm:block" /> <span className="text-[#FFBE00] font-header">Executives</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl max-w-sm sm:max-w-none">
              Explore leadership insights, transformative innovations, and standout student experiences at the core of KNUST’s engineering excellence.
            </p>
          </div>
          <button className="bg-[#FFBE00] text-black px-4 py-2 sm:py-3 rounded-full md:rounded-lg font-semibold flex items-center gap-2 w-fit mx-auto md:mx-0 text-xs sm:text-base">
            <span>Explore more</span>
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              onClick={() => handleDotClick(index)}
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${current === index ? 'bg-white' : 'bg-white/30'} rounded-full cursor-pointer transition-all duration-300 hover:bg-white/60`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Hero;
