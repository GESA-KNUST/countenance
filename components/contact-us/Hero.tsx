'use client';
import Autoplay from "embla-carousel-autoplay"
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Container from '../custom/Container';
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
  images = ['/images/img2.png', '/images/img1.png', '/images/img2.png'],
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
    <div className='relative h-[40vh] md:h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden'>

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
            <CarouselItem key={index} className="relative h-[40vh] md:h-[calc(100vh-var(--navbar-height))] w-full">
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


      <div className='relative z-20 flex flex-col justify-center h-full w-full'>
        <Container size="xl" className="!py-0 text-white">
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-header leading-tight'>
            Connect <span className="text-yellow-500 font-header">With Us</span>
          </h1>
          <p className='text-base md:text-lg lg:text-xl max-w-2xl'>
            Your feedback and inquiries matter to us. Contact us anytime and we’ll respond promptly.
          </p>
        </Container>
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
