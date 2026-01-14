'use client';
import Autoplay from "embla-carousel-autoplay"
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import StarSpinner from "../ui/StarSpinner";

interface HeroSectionProps {
  title?: string;
  highlight?: string;
  text: string | React.ReactNode;
  images?: (string | StaticImageData)[];
  mobileImages?: (string | StaticImageData)[];
  button?: boolean;
  overlayOpacity?: string;
}

const HeroSection = ({
  title,
  highlight,
  text,
  images = ['/images/img1.png', '/images/img2.png', '/images/img1.png', '/images/img2.png'],
  mobileImages,
  button = true,
  overlayOpacity = 'bg-black/40',
}: HeroSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const plugin = useRef(
    Autoplay({
      delay: 10000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

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

  const titleParts = title?.split(highlight) || [];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/blog');
    }, 1000);
  };


  return (
    <div className='relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden'>

      {/* Background Image Carousel */}
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full h-full absolute inset-0"
        opts={{
          loop: true,
          duration: 80,

        }}
      >
        <CarouselContent className="h-full">
          {(isMobile && mobileImages ? mobileImages : images).map((img, index) => (
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

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayOpacity} z-10`} />

      {/* Content */}
      <div className='relative z-20 flex flex-col items-center justify-center text-white px-4 text-center max-w-360 mx-auto gap-2 md:-mt-32'>
        <h1 className='font-bold font-header text-3xl leading-tight sm:text-[50px] sm:leading-tight md:text-[68px] md:leading-[76px] lg:text-[75px] xl:text-[85px] lg:leading-[90px]'>
          {titleParts[0]}
          <span className="text-yellow-500 font-header">{highlight}</span>
          {titleParts[1]}
        </h1>

        <p className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'>
          {text}
        </p>

        {button && (

          loading ? (
            <div className="flex items-center justify-center w-full h-12" >
              <StarSpinner />
            </div>
          ) : (
            <button onClick={handleClick} className="bg-primary font-semibold rounded-full md:rounded-lg flex items-center gap-1 md:px-6 px-4 py-2 cursor-pointer text-black md:text-base text-xs hover:scale-105 transition-transform">
              Explore more <ArrowUpRight className='text-black w-5 h-5 md:w-7 md:h-7' strokeWidth={2.5} />
            </button>
          )
        )}
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

    </div >
  );
};

export default HeroSection;
