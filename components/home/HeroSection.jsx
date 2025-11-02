'use client';
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import img1 from '../../public/images/img1.png';
import img2 from '../../public/images/img2.png';
import { ArrowUpRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";

const HeroSection = () => {
  const [api, setApi] = useState();
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

  const handleDotClick = (index) => {
    if (!api) return;
    api.scrollTo(index);
  };


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
          {[img1, img2, img1, img2].map((img, index) => (
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
        <h1 className='font-bold text-4xl leading-12 sm:text-[60px] sm:leading-16 md:text-[72px] md:leading-[76px] xl:text-[90px] lg:leading-[90px]'>
          Innovating Tomorrow's <span className='text-primary'>Engineers</span>, Today
        </h1>

        <p className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'>
          Empowering students with cutting-edge knowledge, hands-on experience,
          and the tools to shape the future of technology and innovation.
        </p>

        <button className="bg-primary font-semibold rounded-lg flex items-center gap-1 md:px-6 px-4 py-2 cursor-pointer text-black md:text-base text-sm hover:scale-105 transition-transform">
          Explore more <ArrowUpRight className='text-black' strokeWidth={2.5} size={28} />
        </button>
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
