'use client';
import GalleryCard from './GalleryCard';
import { useGalleries } from '../../hooks/useGalleryCollection';

const Gallery = () => {
  const { data: galleries, isLoading, error } = useGalleries();

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-16 space-y-8">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-[350px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-[350px] md:h-[660px] w-full md:flex-1 bg-gray-300 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !galleries) {
    return (
      <div className="bg-white text-center py-16">
        <p className="text-red-500">Failed to load galleries.</p>
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
