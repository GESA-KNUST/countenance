'use client';
import Autoplay from "embla-carousel-autoplay"
import { contentfulImage } from '@/lib/contentful-image';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { usePageHero } from "@/hooks/usePageHero";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeroProps {
  images?: (string | StaticImageData)[];
}

const Hero = ({ images: imagesProp }: HeroProps) => {
  const { hero } = usePageHero('gallery');
  const isMobile = useIsMobile();
  const phoneImages = hero.mobileImages.length > 0 ? hero.mobileImages : hero.images;
  const images = imagesProp ?? (isMobile ? phoneImages : hero.images);

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

    api.reInit();
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, images.length]);

  const handleDotClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const handleExploreMore = () => {
    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className='relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden'>

      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full h-full absolute inset-0"
        opts={{
          loop: true,
          duration: 50,
        }}
      >
        <CarouselContent className="h-full ml-0">
          {images.map((img, index) => (
            <CarouselItem key={index} className="relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full pl-0">
              {typeof img !== 'string' ? (
                <Image
                  src={img}
                  alt={`Hero image ${index + 1}`}
                  fill
                  className="object-cover object-[center_25%]"
                  priority={index === 0}
                  sizes="100vw"
                />
              ) : (() => {
                const hero = contentfulImage(img, {
                  widths: [640, 828, 1080, 1440, 1920, 2560],
                  quality: 78,
                  aspect: isMobile ? 3 / 4 : 16 / 9,
                  focus: 'faces',
                });
                return (
                  <img
                    src={hero.src}
                    srcSet={hero.srcSet || undefined}
                    sizes="100vw"
                    alt={`Hero image ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                );
              })()}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='absolute inset-0 bg-black/40 z-10' />

      <div className='relative z-20 flex flex-col justify-center items-start h-full text-white p-10 md:p-20 lg:p-40'>
        <h1 className='text-6xl md:text-8xl font-bold mb-4 font-header'>
          <span className="font-header">Captured</span>
          <br />
          <span className="text-yellow-500 font-header">Moments</span>
        </h1>
        <p className='text-sm md:text-xl mb-8'>
          Explore photos from our events,activities and unforgettable memories across our community.
        </p>
        <button
          onClick={handleExploreMore}
          className="bg-primary text-black font-semibold py-3 px-6 rounded-full md:rounded-lg flex items-center gap-2 hover:scale-105 transition-transform text-xs md:text-base"
        >
          <span>Explore more</span>
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
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
