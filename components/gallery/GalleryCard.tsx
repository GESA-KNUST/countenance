'use client';
import Image from 'next/image';
import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { type Gallery } from '@/hooks/useGalleryCollection';

interface GalleryCardProps {
  gallery: Gallery | null;
  large?: boolean;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ gallery, large = false }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!gallery || gallery.sampleImagesCollection.items.length <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gallery.sampleImagesCollection.items.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentIndex, gallery]);


  const openPicturesLink = () => {
    if (gallery?.picturesLink) {
      window.open(gallery.picturesLink, '_blank');
    }
  };

  const renderContent = () => {
    if (!gallery || gallery.sampleImagesCollection.items.length === 0) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4 text-center">
          <p className="text-gray-500">Gallery Not Available</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative overflow-hidden">
        {gallery.sampleImagesCollection.items.map((image, index) => (
          <Image
            key={index}
            src={image.url}
            alt={image.title}
            fill
            className={`object-cover group-hover:scale-105 transition-all duration-300 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`relative ${large ? 'h-[350px] md:h-[660px]' : 'h-[350px]'
        } w-full md:flex-1 group overflow-hidden font-poppins ${gallery?.picturesLink ? 'cursor-pointer' : 'cursor-default'
        }`}
      onClick={openPicturesLink}
    >
      {renderContent()}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
        <h3 className="text-xl md:text-2xl font-bold uppercase">
          {gallery?.eventName || 'Gallery'}
        </h3>
      </div>
      {gallery?.picturesLink && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight size={28} />
        </div>
      )}
    </div>
  );
};

export default GalleryCard;
