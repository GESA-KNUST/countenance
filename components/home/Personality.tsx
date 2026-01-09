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
    <div className='md:px-page-x lg:py-page-y font-poppins'>
      {error ? (
        <FetchError />
      ) :
        isLoading ?
          <LoadingPOTW /> :
          <Container size='xl' className="!pb-0">
            <div className='mt-8 mb-0 md:my-16 flex flex-col lg:flex-row items-center gap-10 justify-center overflow-hidden'>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className='w-full md:w-[480px] lg:w-[520px] sm:h-[450px] h-[350px] overflow-hidden shadow-lg relative rounded-2xl'
              >
                {personality?.image?.url ? (
                  <Image
                    src={personality.image.url}
                    alt='potw'
                    fill
                    className='object-cover hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className='flex flex-col gap-4 xl:max-w-xl lg:w-1/2 w-full'
              >
                <div className="space-y-2">
                  <h1 className='font-bold xl:text-3xl text-2xl font-header'>PERSONALITY OF THE WEEK</h1>
                  <p className='xl:text-[22px] text-medium-dark text-lg'>Celebrating Excellence and Innovation.</p>
                </div>
                <div className='font-light xl:text-xl'>{getDescription.slice(0, 400) + '...'}</div>
                <Button
                  onClick={() => setShowModal(true)}
                  variant="default"
                  size="default"
                  className="xl:px-6 py-3 cursor-pointer text-black w-max xl:text-base text-sm"
                >
                  Read more
                </Button>
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
                <div className="mb-6">
                  <h2 className="text-3xl font-bold font-header mb-2 text-primary">PERSONALITY OF THE WEEK</h2>
                  <p className="text-lg text-gray-500 font-medium">Celebrating Excellence</p>
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
