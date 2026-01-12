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

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DepartmentHeroProps {
    title: string;
    subtitle: string;
    text: string;
    images?: (string | StaticImageData)[];
    titleClassName?: string;
    backLink?: string;
    backText?: string;
}

const DepartmentHero = ({
    title,
    subtitle,
    text,
    images = ['/images/dept/dept-4.jpg', '/images/dept/dept-2.jpeg', '/images/dept/dept-1.jpeg'],
    titleClassName,
    backLink,
    backText,
}: DepartmentHeroProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const plugin = useRef(
        Autoplay({
            delay: 10000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
        })
    );

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

    return (
        <div className='relative h-[calc(100vh-var(--navbar-height))] w-full font-poppins flex items-center justify-center overflow-hidden py-12 md:py-0'>
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
            <div className='absolute inset-0 bg-black/40 z-10' />

            {/* Content */}
            <div className='relative z-20 flex flex-col items-center justify-center text-white px-4 text-center max-w-5xl mx-auto gap-3 md:gap-4 md:-mt-32'>
                {backLink && (
                    <Link
                        href={backLink}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-2 md:mb-4 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">{backText || 'Back'}</span>
                    </Link>
                )}
                <h1 className={`font-bold font-header flex flex-col items-center gap-0 ${titleClassName || 'text-3xl leading-tight sm:text-[60px] sm:leading-none md:text-[72px] md:leading-none xl:text-[85px] lg:leading-none'}`}>
                    <span className="block">{title}</span>
                    <span className="text-yellow-500 font-header block">
                        {subtitle}
                    </span>
                </h1>


                <p className='text-xs sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mt-2'>
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

export default DepartmentHero;
