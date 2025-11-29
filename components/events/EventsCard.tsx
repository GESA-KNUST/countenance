import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

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
}


const LinkBox: React.FC<{ href: string; label?: string }> = ({ href, label = 'link' }) => (
  <div className="bg-white text-xs p-2 truncate">
    {label}:{" "}
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
      {href}
    </a>
  </div>
);

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  headerImg,
  venue,
  onlineLink,
  slug,
}) => {
  const [showMap, setShowMap] = useState(false);

  
  const eventDate = new Date(date);
  const compactDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fullDate = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const { url: imgUrl, description: imgDesc } = headerImg;
  const { lat, lon } = venue;
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

  return (
    <div className="min-h-[480px] w-full sm:w-[340px] lg:w-[300px] xl:w-[334px] shadow-lg p-5 flex flex-col justify-between rounded transition-transform duration-300 hover:scale-[1.02]">
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

        
        <div className="flex items-start gap-1 flex-wrap">
          <h1 className="text-2xl font-bold font-open_sans w-auto min-w-0">{title}</h1>
          <ArrowUpRight className="shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        
        <p className="text-text-gray line-clamp-3 overflow-hidden max-h-14">{description}</p>

        
        <div className="relative">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-1 font-medium text-sm cursor-pointer"
            aria-label="View venue on map"
          >
            <MapPin className="w-4 h-4 text-red-500" />
            <span>View on Map</span>
          </button>

          {showMap && (
            <div className="mt-2 w-full border rounded shadow-lg overflow-hidden">
              <iframe
                width="100%"
                height="200"
                src={`https://maps.google.com/maps?q=${lat},${lon}&output=embed`}
                allowFullScreen
                loading="lazy"
                className="border-0 w-full h-full"
              ></iframe>
              <LinkBox href={googleMapsLink} />
            </div>
          )}
        </div>

       
        {onlineLink && <LinkBox href={onlineLink} />}
      </div>

      
      <div className="flex gap-2 mt-4">
        <p className="text-xs text-text-gray">
          <span className="md:hidden">{compactDate}</span>
          <span className="hidden md:inline">{fullDate}</span>
        </p>
      </div>
    </div>
  );
};

export default EventCard;
