import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface EventCardProps {
    title: string;
    description: string;
    author: {
        title: string;
        url: string;
        description: string;
    };
    date: string;
    headerImg: {
        url: string;
        description: string;
    };
}

const EventCard: React.FC<EventCardProps> = ({ title, description, author, date, headerImg }) => {
    return (
        <div className='h-[580px] xl:w-[334px] lg:w-[300px] sm:w-[340px] w-full shadow-lg p-5 flex justify-center rounded cursor-pointer hover:scale-102 hover:rotate-1 transition-transform duration-300'>
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
                <div className='flex gap-2'>
                    <div className='h-10 w-10 rounded-full'>
                        <Image src={author.url} alt={author.description} width={40} height={40} className='h-full w-full object-cover rounded-full' />
                    </div>
                    <div>
                        <h4 className='font-medium text-sm'>{author.title}</h4>
                        <p className='md:text-sm text-xs text-text-gray'>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard;
