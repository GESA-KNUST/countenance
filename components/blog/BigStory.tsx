'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import star from '../../public/images/star.svg';
import logo from '../../public/images/logo.svg';
import fb2 from '../../public/images/fb2.svg';
import twitter from '../../public/images/twitter.svg';
import yt from '../../public/images/yt.svg';
import linkedin2 from '../../public/images/linkedin2.svg';
import { Separator } from '../ui/separator';
import { motion } from 'framer-motion';
import StarSpinner from '../ui/StarSpinner';
import useBlogCollection from '../../hooks/useBlogCollection';

const BigStory = () => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const { data: allPosts } = useBlogCollection();
  const router = useRouter();

  useEffect(() => {
    if (allPosts) {
      const slug = 'the-ghana-engineering-students-association-gesa-knust';
      const foundPost = allPosts.find(p => p.slug === slug);
      setPost(foundPost);
    }
  }, [allPosts]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(`/blog-2?slug=${post.slug}`);
    }, 1000);
  };

  const getTag = () => {
    if (!post || !post.tags) return 'Uncategorized';
    if (Array.isArray(post.tags) && post.tags.length > 0) {
      const tag = post.tags[0];
      return typeof tag === 'string' ? tag : tag.title;
    }
    if (typeof post.tags === 'object' && Array.isArray(post.tags.tags) && post.tags.tags.length > 0) {
      const tag = post.tags.tags[0];
      return typeof tag === 'string' ? tag : tag.title;
    }
    return 'Uncategorized';
  };

  if (!post) {
    return (
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col-reverse xl:flex-row gap-6 md:gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-4 md:gap-6 max-w-full xl:max-w-[600px]">
            <div className="h-8 w-1/2 bg-gray-200 animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse"></div>
            <div className="h-20 w-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="w-full xl:w-[500px] h-[424px] lg:h-[574px] rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse xl:flex-row gap-6 md:gap-10 lg:gap-16 items-center">
        {/* Text Section */}
        <div className="flex flex-col gap-4 md:gap-6 max-w-full xl:max-w-[600px]">
          <div className="flex gap-3 items-center">
            <Image src={star} alt="star icon" />
            <h4 className="text-sm text-primary font-semibold">{post.author.name}</h4>
            <Image src={star} alt="star icon" />
          </div>
          <h1 className="font-open_sans font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900">
            {post.title}
          </h1>
          <div className="bg-primary rounded h-1 w-10"></div>
          <p className="font-open_sans font-medium text-sm sm:text-base text-gray-700">
            {post.hook}
          </p>

          {loading ? (
            <div className="flex items-center justify-start w-full h-12">
              <StarSpinner />
            </div>

          ) : (
            <motion.button
              onClick={handleClick}
              className="bg-primary rounded-lg px-6 py-3 text-black font-semibold text-sm sm:text-base w-max hover:scale-105 cursor-pointer transition-transform duration-300"
              whileTap={{ scale: 0.95 }}
            >
              Read more
            </motion.button>
          )}

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
        <div className="w-full h-[304px] md:h-[424px] lg:h-[500px] rounded-md overflow-hidden relative">
          <Image
            src={post.headerImage.url}
            alt={post.headerImage.description || post.title}
            className="object-cover rounded"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
};

export default BigStory;
