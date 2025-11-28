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
    venue: string;
    onlineLink?: string;
    slug: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, description, date, headerImg, venue, onlineLink, slug }) => {
    return (
        <div className='h-[520px] md:h-[480px] sm:h-[440px] xl:w-[334px] lg:w-[300px] sm:w-[340px] w-full shadow-lg p-5 flex justify-center rounded cursor-pointer hover:scale-102 hover:rotate-1 transition-transform duration-300'>
            <div className='flex flex-col gap-5'>
                <div className='h-60'>
                    <Image src={headerImg.url} alt={headerImg.description} width={300} height={240} className='w-full h-full object-cover' />
                </div>
                <h1 className='font-semibold text-primary text-sm'>Event</h1>
                <div className='flex'>
                    <h1 className='text-2xl font-bold font-open_sans'>{title}</h1>
                    <ArrowUpRight/>
                </div>
                <p className='text-text-gray'>{description}</p>
                <div>
                    <p className='font-medium text-sm'>Venue: {venue}</p>
                    {onlineLink && <a href={onlineLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 break-words">{onlineLink}</a>}
                </div>
                <div className='flex gap-2'>
                    <div>
                        <p className='md:text-sm text-xs text-text-gray'>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard;