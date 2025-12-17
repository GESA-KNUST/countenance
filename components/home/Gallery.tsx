'use client'
import Image from 'next/image';
import React from 'react'
import img1 from '../../public/images/img1.png'
import img2 from '../../public/images/potw.png'
import img3 from '../../public/images/galleryImg.png'
import img4 from '../../public/images/galleryimg2.png'
import { motion } from 'framer-motion';
import Link from 'next/link';

const Gallery = () => {
    return (
        <div className='md:px-page-x px-page-sx font-poppins my-20 bg-[#F9FBFD]'>
            <div className='max-w-360 mx-auto flex gap-12 flex-col py-20'>
                <h1 className='font-open_sans font-bold text-3xl'>Gallery</h1>


                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[img1, img2, img3, img2, img1, img4].map((img, index) => (
                        <div
                            key={index}
                            className="relative rounded overflow-hidden bg-white/80 h-[280px] md:h-[380px] group cursor-pointer transition duration-500"
                            aria-label={`Gallery image ${index + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>

                <div className='grid place-content-center'>
                    <motion.button
                        className="bg-primary rounded-lg px-6 py-3 text-black font-semibold text-sm sm:text-base w-max hover:scale-105 cursor-pointer transition-transform duration-300"
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href='/gallery'>View More</Link>
                    </motion.button>
                </div>



            </div>
        </div>
    )
}

export default Gallery;