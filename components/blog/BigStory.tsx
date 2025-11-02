import Image from 'next/image';
import React from 'react';
import star from '../../public/images/star.svg';
import storyImg from '../../public/images/image 26.png';
import logo from '../../public/images/logo.svg';
import fb2 from '../../public/images/fb2.svg';
import twitter from '../../public/images/twitter.svg';
import yt from '../../public/images/yt.svg';
import linkedin2 from '../../public/images/linkedin2.svg';
import { Separator } from '../ui/separator';
import blogImg1 from '../../public/images/blogImg1.png'

const BigStory = () => {
  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse xl:flex-row gap-6 md:gap-10 lg:gap-16 items-center">
        {/* Text Section */}
        <div className="flex flex-col gap-4 md:gap-6 max-w-full xl:max-w-[600px]">
          <div className="flex gap-3 items-center">
            <Image src={star} alt="star icon" />
            <h4 className="text-sm text-primary font-semibold">AGYAPONG ALBERT YEBOAH</h4>
            <Image src={star} alt="star icon" />
          </div>
          <h1 className="font-open_sans font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900">
            The Ghana Engineering Students Association - GESA KNUST
          </h1>
          <div className="bg-primary rounded h-1 w-10"></div>
          <p className="font-open_sans font-medium text-sm sm:text-base text-gray-700">
            The Ghana Engineering Students' Association (GESA-KNUST) was officially established to serve as the recognized representative body for all engineering students at Kwame Nkrumah University of Science and Technology. GESA-KNUST operates as an autonomous, non-partisan student organization dedicated to promoting academic excellence, professional development, and unity among engineering students. The Association...
          </p>
          <button className="bg-primary rounded-lg px-6 py-3 text-black font-semibold text-sm sm:text-base w-max">
            Read more
          </button>
          <div className="flex items-center gap-4 mt-4">
            <Image src={logo} alt="logo" />
            <div className="h-10">
              <Separator orientation="vertical" className="w-full" />
            </div>
            <div className="flex gap-2">
              <Image src={fb2} alt="Facebook" />
              <Image src={twitter} alt="Twitter" />
              <Image src={yt} alt="YouTube" />
              <Image src={linkedin2} alt="LinkedIn" />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full xl:w-[500px] h-[424px] lg:h-[574px] rounded overflow-hidden">
          <Image
            src={storyImg}
            alt="GESA story image"
            className="w-full h-full object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default BigStory;
