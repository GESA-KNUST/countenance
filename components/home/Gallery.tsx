'use client'
import Image from 'next/image';
import React from 'react'
import img1 from '../../public/images/img1.png'
import img2 from '../../public/images/potw.png'
import img3 from '../../public/images/galleryImg.png'
import img4 from '../../public/images/galleryimg2.png'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGalleries } from '@/hooks/useGalleryCollection';
import FetchError from '../custom/FetchError';

const Gallery = () => {
    const { data: galleries, isLoading, error } = useGalleries()
    const openPicturesLink = (pictureLink: string) => {
        if (pictureLink) {
            window.open(pictureLink, '_blank');
        }
    };

  if (error) {
    return <FetchError />
  }


    return (
        <div className='md:px-page-x px-page-sx font-poppins my-20 bg-[#F9FBFD]'>
            <div className='max-w-360 mx-auto flex gap-12 flex-col py-20'>
                <h1 className='font-header font-bold text-3xl'>Gallery</h1>


                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4">
                    {galleries?.map((img, index) => {
                        const getSpanClasses = (i: number) => {
                            switch (i) {
                                case 0: return "md:col-span-2 md:row-span-2";
                                case 1: return "md:col-span-1 md:row-span-2";
                                case 2: return "md:col-span-1 md:row-span-1";
                                case 3: return "md:col-span-1 md:row-span-1";
                                case 4: return "md:col-span-2 md:row-span-1";
                                case 5: return "md:col-span-2 md:row-span-1";
                                default: return "md:col-span-1 md:row-span-1";
                            }
                        };

                        return (
                            <div
                                key={index}
                                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${getSpanClasses(index)}`}
                                aria-label={`Gallery image ${index + 1}`}
                                onClick={() => openPicturesLink(img.picturesLink)}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img.sampleImagesCollection.items[0].url}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        fill
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div>
                                        <p className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            Event Highlight
                                        </p>
                                        <p className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            View details
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='flex justify-center mt-8'>
                    <Link href='/gallery'>
                        <motion.button
                            className="bg-primary rounded-full px-8 py-3 text-black font-semibold text-sm sm:text-base hover:shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                        >
                            View Full Gallery
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </Link>
                </div>



            </div>
        </div>
    )
}

export default Gallery;