'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, X } from 'lucide-react';

interface ImageType {
  url: string;
  description: string;
}

interface VenueType {
  lat: number;
  lon: number;
}

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  headerImg: ImageType;
  venue: VenueType;
  onlineLink?: string;
  slug: string;
  isHeroCard?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  headerImg,
  venue,
  onlineLink,
  slug,
  isHeroCard,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { url: imgUrl, description: imgDesc } = headerImg;
  const { lat, lon } = venue;
  const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;

  const handleMapToggle = (e: React.MouseEvent, show: boolean) => {
    e.stopPropagation();
    setShowMap(show);
    if (show) {
      setMapLoading(true);
      setMapError(false);
    }
  };

  const hasOnlineLink = !!onlineLink;

  const handleCardClick = () => {
    if (isHeroCard) return;

    if (hasOnlineLink) {
      window.open(onlineLink, '_blank');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showMap && mapLoading) {
      timer = setTimeout(() => {
        if (mapLoading) setMapError(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showMap, mapLoading]);

  // Unified card style matching BlogCard
  const cardClasses = "h-full flex flex-col bg-white overflow-hidden shadow-lg rounded-xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300";

  return (
    <div className="h-full w-full" ref={cardRef}>
      <div
        className={cardClasses}
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="h-48 sm:h-60 w-full relative shrink-0 bg-gray-100">
          <Image
            src={imgUrl}
            alt={imgDesc}
            fill
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col grow p-4 sm:p-6">
          <div className="grow">
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <h1 className="font-header text-lg sm:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                {title}
                {hasOnlineLink && (
                  <ArrowUpRight className="inline-block ml-1 w-4 h-4 text-gray-400" />
                )}
              </h1>
            </div>

            <p className="text-gray-500 line-clamp-3 mb-3 sm:mb-4 text-sm">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              {formattedDate}
            </p>

            <button
              onClick={(e) => handleMapToggle(e, true)}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition-colors px-2 py-1 rounded hover:bg-gray-100"
              aria-label="View venue on map"
            >
              <MapPin className="w-3.5 h-3.5 text-yellow-500" />
              <span>View Map</span>
            </button>
          </div>
        </div>
      </div>

      {showMap && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShowMap(false);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-bold text-lg text-gray-900">Event Location</h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 w-full bg-gray-50">
              {/* Loading State */}
              {mapLoading && !mapError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-yellow-500 font-semibold animate-pulse">Loading Map...</span>
                </div>
              )}

              {/* Error State */}
              {mapError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-red-500 font-medium mb-1">Unable to load map</p>
                  <button
                    onClick={() => setMapLoading(true)}
                    className="text-xs text-blue-500 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!mapError && (
                <iframe
                  width="100%"
                  height="100%"
                  src={googleMapsUrl}
                  allowFullScreen
                  loading="lazy"
                  className={`border-0 w-full h-full transition-opacity duration-300 ${mapLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setMapLoading(false)}
                />
              )}
            </div>
            <div className="p-3 bg-gray-50 text-xs text-center text-gray-500 border-t">
              Click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
