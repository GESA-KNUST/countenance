'use client';
import Autoplay from "embla-carousel-autoplay"
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

interface HeroSectionProps {
  title?: string;
  highlight?: string;
  text: string;
  images?: (string | StaticImageData)[];
}

const HeroSection = ({
  title = "Innovating Tomorrow's Engineers, Today",
  highlight = "Engineers",
  images = ['/images/img1.png', '/images/img2.png', '/images/img1.png', '/images/img2.png'],
  text
}: HeroSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = useRef(
    Autoplay({
      delay: 8000,
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

  const titleParts = title.split(highlight);


  return (
    <div className='relative h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden'>

      {/* Background Image Carousel */}
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

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/65 z-10' />

      {/* Content */}
      <div className='relative z-20 flex flex-col items-center justify-center text-white px-4 text-center max-w-360 mx-auto gap-6 -mt-32'>
        <h1 className='font-bold font-header text-4xl leading-12 sm:text-[60px] sm:leading-16 md:text-[72px] md:leading-[76px] xl:text-[90px] lg:leading-[90px]'>
          Engineering <span className="text-[#FFBE00] font-header">Vibe</span>
        </h1>

        <p className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'>
          {text}
        </p>
      </div>

      {/* Progress Dots */}
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

export default HeroSection;