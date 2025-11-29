import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  headerImg: {
    url: string;
    description: string;
  };
  venue: {
    lat: number;
    lon: number;
  };
  onlineLink?: string;
  slug: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  date,
  headerImg,
  venue,
  onlineLink,
  slug,
}) => {
  const compactDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
  });

 
  const fullDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric', 
    year: 'numeric', 
  });

  return (
    
    <div className='min-h-[480px] w-full sm:w-[340px] lg:w-[300px] xl:w-[334px] shadow-lg p-5 flex flex-col justify-between rounded cursor-pointer group hover:scale-[1.02] transition-transform duration-300'>
      
      <div className='flex flex-col gap-4'> 
        
       
        <div className='h-60 shrink-0'> 
          <Image
            src={headerImg.url}
            alt={headerImg.description}
            width={340} 
            height={240} 
            className='w-full h-full object-cover rounded'
          />
        </div>

        <h1 className='font-semibold text-primary text-sm'>Event</h1>


        <div className='flex items-start gap-1 flex-wrap'>
          <h1 className='text-2xl font-bold font-open_sans w-auto min-w-0'>{title}</h1> 
          <ArrowUpRight className='shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' /> 
        </div>

        
        <p className='text-text-gray line-clamp-3 overflow-hidden max-h-14'>
          {description}
        </p> 

        
        <div> 
          <p className='font-medium text-sm truncate'>
            Venue: {venue.lat}, {venue.lon}
          </p>

          {onlineLink && (
            <a
              href={onlineLink}
              target="_blank"
              rel="noopener noreferrer"
              
              className="text-sm text-blue-500 block truncate"
            >
              {onlineLink}
            </a>
          )}
        </div>
      </div>

      
      <div className='flex gap-2 mt-4'> 
        <p className='text-xs text-text-gray'>
          <span className='md:hidden'>{compactDate}</span> 
          <span className='hidden md:inline'>{fullDate}</span> 
        </p>
      </div>
    </div>
  );
};

export default EventCard;