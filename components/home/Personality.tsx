'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../custom/Container';
import { POTWItem, usePOTW } from '@/hooks/usePOTW';
import { extractText } from '@/lib/extractText';
import LoadingPOTW from './LoadingPOTW';
import FetchError from '../custom/FetchError';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { proseRichTextOptions } from '@/lib/richTextOptions';
import { contentfulImage } from '@/lib/contentful-image';
import { personalitySlug } from '@/lib/data/potw';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Personality = ({ initial }: { initial?: POTWItem[] | null }) => {
  const { data: potw, isLoading, error } = usePOTW(initial)
  const personality = potw && potw.length > 0 ? potw[0] : undefined;
  const getDescription = personality ? extractText(personality.description?.json) : '';





  return (
    <div id="personality-of-the-week" className='md:px-page-x lg:py-page-y font-poppins scroll-mt-20'>
      {error ? (
        <FetchError />
      ) :
        isLoading ?
          <LoadingPOTW /> :
          <Container size='xl' className="!pb-0">
            <div className='mt-8 mb-0 md:my-16 flex flex-col lg:flex-row items-center gap-10 justify-center overflow-hidden perspective-1000'>

              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                className='w-full md:w-[480px] lg:w-[520px] sm:h-[450px] h-[350px] overflow-hidden shadow-2xl relative rounded-2xl group'
              >
                {personality?.image?.url ? (
                  <>
                    {(() => {
                      const portrait = contentfulImage(personality.image.url, {
                        widths: [480, 640, 960, 1040],
                        aspect: 520 / 450,
                        focus: 'face',
                      });
                      return (
                        <img
                          src={portrait.src}
                          srcSet={portrait.srcSet || undefined}
                          sizes="(max-width: 768px) 100vw, 520px"
                          alt={personality.image.title || 'Personality of the week'}
                          className='absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out'
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
              </motion.div>


              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.3 }
                  }
                }}
                className='flex flex-col gap-4 xl:max-w-xl lg:w-1/2 w-full'
              >
                <div className="space-y-2">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className='font-bold xl:text-3xl text-2xl font-header'
                  >
                    PERSONALITY OF THE WEEK
                  </motion.h1>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                    className='xl:text-[22px] text-medium-dark text-lg'
                  >
                    Celebrating Excellence and Innovation.
                  </motion.p>
                </div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className='font-light xl:text-xl'
                >
                  {getDescription.slice(0, 400) + '...'}
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                >
                  <Link href={personality ? `/personality/${personalitySlug(personality)}` : '/'}>
                    <Button
                      variant="default"
                      size="default"
                      className="xl:px-6 py-3 cursor-pointer text-black w-max xl:text-base text-sm hover:translate-x-1 transition-transform"
                    >
                      Read more
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

            </div>
          </Container>
      }


    </div>
  )
}

export default Personality;
