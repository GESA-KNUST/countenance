import Image from 'next/image';
import React from 'react'
import img1 from '../../public/images/img1.png'
import img2 from '../../public/images/potw.png'
import img3 from '../../public/images/galleryImg.png'
import img4 from '../../public/images/galleryimg2.png'

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



            </div>
        </div>
    )
}

export default Gallery;