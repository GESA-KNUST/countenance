'use client';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import BlogCard from '../blog/BlogCard';

const HeroSection = ({ heroImage, title, subtitle, currentIndex, total, onNext, onPrev, items }) => {

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height))] w-full flex items-center justify-center">
      <Image src={heroImage} alt="background image" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 w-full flex flex-col lg:flex-row items-center justify-between text-white p-6 sm:p-8 md:p-12 lg:p-20 xl:p-24 gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-tight">
            {title} <span className="text-[#FFBE00]">Events</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl max-w-lg mx-auto lg:mx-0">{subtitle}</p>

          <div className="mt-8 flex flex-col items-center lg:items-start gap-4">
            <button className="bg-[#FFBE00] text-black px-5 py-3 rounded-lg font-semibold flex items-center gap-2">
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
            <div
              className="flex gap-6 items-center transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (334 + 24)}px)` }}
            >
                {items && items.map((item, index) => {
                    let opacityClass = 'opacity-25';
                    if (index === currentIndex) {
                        opacityClass = 'opacity-100';
                    } else if (index === currentIndex + 1) {
                        opacityClass = 'opacity-50';
                    }

                    return (
                        <div
                          key={item.id}
                          className={`w-[334px] shrink-0 transition-opacity duration-300 ${opacityClass}`}
                         >
                          <BlogCard title={item.title} author={item.author} date={item.date} />
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="lg:hidden w-full max-w-sm mx-auto mt-8">
          <div className="relative h-[580px] overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${currentIndex * 100}%)` }}
            >
              {items && items.map((item) => (
                <div key={item.id} className="w-full h-full shrink-0 p-4">
                  <BlogCard title={item.title} author={item.author} date={item.date} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 text-white">
            <button onClick={onPrev} className="p-3 border border-white/30 rounded-full">
              <ChevronUp />
            </button>
            <span>{currentIndex + 1}/{total}</span>
            <button onClick={onNext} className="p-3 border border-white rounded-full">
              <ChevronDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
