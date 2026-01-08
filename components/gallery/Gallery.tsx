'use client';
import GalleryCard from './GalleryCard';
import { useGalleries } from '../../hooks/useGalleryCollection';
import EmptyState from '../events/EmptyState';
import { Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const { data: galleries, isLoading, error } = useGalleries();

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-16 space-y-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white">
        <EmptyState
          title="Failed to Load Gallery"
          message="We encountered an issue loading the gallery. Please try again later."
          icon={ImageIcon}
          showHomeButton={true}
          onRefresh={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!galleries || galleries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-white">
        <EmptyState
          title="Gallery is Empty"
          message="We haven't uploaded any photos yet. Check back soon for visual updates from our events and activities."
          icon={ImageIcon}
          showHomeButton={true}
        />
      </div>
    );
  }

  const galleryRows = [
    galleries.slice(0, 4),
    galleries.slice(4, 7),
    galleries.slice(7, 11),
  ];

  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-16 space-y-8">
        {galleryRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col md:flex-row gap-5">
            {row.map((gallery) => (
              <GalleryCard
                key={gallery.sys.id}
                gallery={gallery}
                large={rowIndex === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
