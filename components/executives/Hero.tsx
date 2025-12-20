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
  images = ['/images/image 26.png', '/images/img2.png', '/images/img1.png', '/images/img2.png'],
}: HeroProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

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
    <div className='relative h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden'>

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
            <CarouselItem key={index} className="relative h-[calc(100vh-var(--navbar-height))] w-full">
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

      
      <div className='absolute inset-0 bg-black/65 z-10' />

      
      <div className="relative z-20 flex flex-col justify-center items-center text-center md:items-start md:text-left h-full text-white p-8 sm:p-12 md:p-16 lg:p-20">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-header sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none">
              Our  <span className="text-[#FFBE00]">Executives</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl">
              Explore leadership insights, transformative innovations, and standout student experiences at the core of KNUST’s engineering excellence.
            </p>
          </div>
          <button className="bg-[#FFBE00] text-black px-4 py-3 rounded-lg font-semibold flex items-center gap-2 w-fit mx-auto md:mx-0">
            <span>Explore more</span>
            <ArrowUpRight className="h-5 w-5" />
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
              className={`w-4 h-4 ${current === index ? 'bg-white' : 'bg-white/30'} rounded-full cursor-pointer transition-all duration-300 hover:bg-white/60`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Hero;
