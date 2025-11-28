
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[calc(100vh-var(--navbar-height))]">
      <Image
        src="/images/image 26.png"
        alt="background image"
        fill
        className="object-cover object-top z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col justify-center items-center text-center md:items-start md:text-left h-full text-white p-8 sm:p-12 md:p-16 lg:p-20">
        <div className="flex flex-col gap-8 max-w-4xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-tight">
              Our <br /> <span className="text-[#FFBE00]">Executives</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl">
              Explore leadership insights, transformative innovations, and standout student experiences at the core of KNUST’s engineering excellence.
            </p>
          </div>
          <button className="bg-[#FFBE00] text-black px-4 py-3 rounded-lg font-semibold flex items-center gap-2 w-fit mx-auto md:mx-0">
            <span>Explore more</span>
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
