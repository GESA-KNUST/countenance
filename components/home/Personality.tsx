'use client'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import Container from '../custom/Container';
import { POTWItem, usePOTW } from '@/hooks/usePOTW';
import { extractText } from '@/lib/extractText';
import LoadingPOTW from './LoadingPOTW';
import FetchError from '../custom/FetchError';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Personality = () => {
  const { data: potw, isLoading, error } = usePOTW()
  const [personality, setPersonality] = useState<POTWItem>()
  const [getDescription, setDescription] = useState<string>('')
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (potw && potw.length > 0) {
      const item = potw[0]
      setPersonality(item)
      setDescription(extractText(item.description.json))
    }
  }, [potw])
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
                className='w-full md:w-[480px] lg:w-[520px] sm:h-[450px] h-[350px] overflow-hidden shadow-2xl relative rounded-2xl group cursor-pointer'
                onClick={() => setShowModal(true)}
              >
                {personality?.image?.url ? (
                  <>
                    <Image
                      src={personality.image.url}
                      alt='potw'
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-1000 ease-out'
                    />
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
                  <Button
                    onClick={() => setShowModal(true)}
                    variant="default"
                    size="default"
                    className="xl:px-6 py-3 cursor-pointer text-black w-max xl:text-base text-sm hover:translate-x-1 transition-transform"
                  >
                    Read more
                  </Button>
                </motion.div>
              </motion.div>

            </div>
          </Container>
      }

      <AnimatePresence>
        {showModal && personality && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6 sm:px-6"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 260 }}
              className="bg-white relative z-10 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative shrink-0">
                <Image
                  src={personality.image.url}
                  alt={personality.image.title || 'POTW'}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 lg:p-12 overflow-y-auto">
                <div className="mb-6 flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-3xl font-bold font-header mb-2 text-primary">PERSONALITY OF THE WEEK</h2>
                    <p className="text-lg text-gray-500 font-medium">Celebrating Excellence</p>
                  </div>
                  {personality.linkedin && (
                    <a
                      href={personality.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 p-3 bg-[#0077b5] text-white rounded-lg hover:bg-[#006097] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      title="Connect on LinkedIn"
                    >
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 21.227.792 22 1.771 22h20.451C23.2 22 24 21.227 24 20.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                    </a>
                  )}
                </div>

                <div className="text-gray-700 leading-relaxed space-y-4">
                  {documentToReactComponents(personality.description.json)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Personality;
