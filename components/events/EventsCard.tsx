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

  const eventDate = new Date(date);
  const compactDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fullDate = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
    if (isHeroCard) {
      return;
    }
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

  const cardClasses = isHeroCard
    ? 'relative group bg-white h-[480px] w-full sm:w-[340px] lg:w-[300px] xl:w-[334px] shadow-lg rounded transition-transform duration-300 hover:scale-[1.02] cursor-pointer'
    : 'relative group bg-white min-h-[480px] w-full sm:w-[340px] lg:w-[300px] xl:w-[334px] shadow-lg rounded transition-transform duration-300 hover:scale-[1.02] cursor-pointer';

  const descriptionClasses = isHeroCard
    ? 'text-text-gray line-clamp-3 overflow-hidden h-20'
    : 'text-text-gray line-clamp-3 overflow-hidden max-h-14 lg:h-20';

  const titleWords = title.split(' ');
  const lastWord = titleWords.pop();
  const restOfTitle = titleWords.join(' ');

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      onClick={handleCardClick}
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          <div className="relative h-60 w-full shrink-0">
            <Image
              src={imgUrl}
              alt={imgDesc}
              fill
              className="object-cover rounded"
            />
          </div>

          <h1 className="font-semibold text-primary text-sm">Event</h1>

          <h1 className="text-2xl font-bold font-open_sans w-auto min-w-0 lg:h-16 lg:line-clamp-2 text-black">
            {restOfTitle}
            <span className="whitespace-nowrap">
              {' '}{lastWord}
              {hasOnlineLink ? (
                <Link
                  href={onlineLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block ml-1"
                >
                  <ArrowUpRight className="shrink-0 text-black transition-transform duration-300 group-hover:rotate-45 animate-pulse" />
                </Link>
              ) : (
                <ArrowUpRight className="shrink-0 inline-block ml-1 text-black" />
              )}
            </span>
          </h1>

          <p className={descriptionClasses}>{description}</p>

          <div>
            <button
              onClick={(e) => handleMapToggle(e, true)}
              className="flex items-center gap-1 font-medium text-sm cursor-pointer z-10 relative p-2 -m-2"
              aria-label="View venue on map"
            >
              <MapPin className="w-4 h-4 text-yellow-400" />
              <span className="text-black">View on Map</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <p className="text-xs text-text-gray">
            <span className="md:hidden">{compactDate}</span>
            <span className="hidden md:inline">{fullDate}</span>
          </p>
        </div>
      </div>

      {showMap && (
        <div
          className="absolute inset-0 bg-white z-20 p-4 flex flex-col shadow-lg rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-black">Venue or Location</h2>
            <button
              onClick={() => setShowMap(false)}
              className="p-1 text-gray-700 hover:text-black"
              aria-label="Close map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading */}
          {mapLoading && !mapError && (
            <div className="flex items-center justify-center h-48 w-full bg-gray-100 rounded relative">
              <span className="text-yellow-400 font-bold text-lg animate-pulse">
                Map Loading
                <span className="inline-block ml-1">
                  <span className="animate-bounce inline-block">.</span>
                  <span className="animate-bounce delay-150 inline-block">.</span>
                  <span className="animate-bounce delay-300 inline-block">.</span>
                </span>
              </span>
            </div>
          )}

          {/* Error */}
          {mapError && (
            <div className="flex flex-col items-center justify-center h-48 w-full bg-red-100 rounded p-4">
              <p className="text-red-600 font-bold text-center text-lg">
                ⚠️ Unable to load map.
              </p>
              <p className="text-red-500 text-center text-sm mt-2">
                Please check your connection or try again later.
              </p>
            </div>
          )}

          {!mapError && (
            <iframe
              width="100%"
              height="200"
              src={googleMapsUrl}
              allowFullScreen
              loading="lazy"
              className={`border-0 w-full h-full rounded transition-opacity duration-500 ${mapLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setMapLoading(false)}
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
