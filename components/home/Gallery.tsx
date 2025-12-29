'use client'
import Image from 'next/image';
import React from 'react'
import img1 from '../../public/images/img1.png'
import img2 from '../../public/images/potw.png'
import img3 from '../../public/images/galleryImg.png'
import img4 from '../../public/images/galleryimg2.png'
import { motion } from "framer-motion";
import Link from "next/link";
import { useGalleries } from "@/hooks/useGalleryCollection";
import FetchError from "../custom/FetchError";

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
        <div className='md:px-page-x px-page-sx font-poppins py-16 bg-[#F9FBFD] overflow-hidden'>
            <div className='max-w-7xl mx-auto flex flex-col gap-12'>
                <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className='font-header font-bold text-4xl md:text-5xl text-gray-900 px-4 md:px-0'
                >
                    Gallery
                </motion.h1>


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
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-3xl overflow-hidden group cursor-pointer ${getSpanClasses(index)} shadow-sm hover:shadow-2xl transition-all duration-500`}
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
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500" />
                                <div className="absolute inset-0 flex items-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <div>
                                        <p className="text-white font-bold text-xl mb-1">
                                            Event Highlight
                                        </p>
                                        <p className="text-white/80 text-sm font-medium">
                                            View Full Album
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className='flex justify-center mt-12'>
                    <Link href='/gallery'>
                        <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-primary rounded-2xl px-10 py-4 text-black font-bold text-base hover:shadow-2xl hover:bg-primary/90 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                            whileTap={{ scale: 0.95 }}
                        >
                            View Full Gallery
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
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