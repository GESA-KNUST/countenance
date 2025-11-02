import Image from 'next/image';
import EventImg from '../../public/images/eventImg.png';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import arrowRight from '../../public/images/arrowRight.svg'

const RecentEvent = () => {

    const recentEvents = [
        {
            title: 'GESA Hangout 2025',
            description: 'Some description about GESA Hangout 2025 and how it went',
            date: '20th June, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Hangout 2025',
            description: 'Some description about GESA Hangout 2025 and how it went',
            date: '20th June, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Hangout 2025',
            description: 'Some description about GESA Hangout 2025 and how it went',
            date: '20th June, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Hangout 2025',
            description: 'Some description about GESA Hangout 2025 and how it went',
            date: '20th June, 2025',
            image: EventImg,
        },
    ];

    const upcomingEvents = [
        {
            title: 'GESA Praises & Worship',
            date: '30th August, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Praises & Worship',
            date: '30th August, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Praises & Worship',
            date: '30th August, 2025',
            image: EventImg,
        },
        {
            title: 'GESA Praises & Worship',
            date: '30th August, 2025',
            image: EventImg,
        },
    ];

    return (
        <section className='md:px-page-x lg:py-page-y px-page-sx font-poppins my-16'>
            <div className='max-w-360 mx-auto flex gap-12 flex-col lg:flex-row'>

                {/* Recent Events */}
                <div className='flex flex-col gap-8 flex-1'>
                    <h2 className='font-open_sans font-bold text-3xl'>Recent Events</h2>
                    <div className='flex flex-col gap-8'>

                        {recentEvents.map((event, i) => (
                            <div
                                key={i}
                                className='flex md:gap-6 gap-3 cursor-pointer rounded-md transition-all hover:scale-105 duration-500 group:'>
                                <div className='overflow-hidden rounded-xl'>
                                    <Image
                                        src={event.image}
                                        alt='eventimg'
                                        className='h-[140px] w-[188px] object-cover rounded-md transition-all group-hover:scale-105'
                                    />
                                </div>
                                <div className='flex flex-col md:gap-12 gap-6 font-open_sans group-hover:scale-105 duration-500'>
                                    <div className='space-y-1'>
                                        <h3 className='font-bold sm:text-lg text-base'>{event.title}</h3>
                                        <p className='text-medium-dark md:text-sm text-xs line-clamp-2'>
                                            {event.description}
                                        </p>
                                    </div>
                                    <div className='flex justify-between items-center sm:text-sm text-xs'>
                                        <span className='text-gray-500'>{event.date}</span>
                                        <Link href="/" className='hover:translate-x-1 transition-all'>
                                            <Image src={arrowRight} alt='arrow'/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className='hidden lg:block'>
                    <Separator orientation='vertical' className="h-full bg-separator" />
                </div>

                {/* Upcoming Events */}
                <div className='flex flex-col gap-8 flex-1'>
                    <h2 className='font-bold text-3xl font-open_sans'>Upcoming Events</h2>

                    <div className='flex flex-col sm:gap-6 gap-4'>
                        {upcomingEvents.map((event, i) => (
                            <div className='flex gap-4 bg-white/70 p-4 rounded-xl cursor-pointer hover:scale-105 transition-all duration-500 group:' key={i}>
                                <Image
                                    src={event.image}
                                    alt='evenimg'
                                    className='w-12 h-12 object-cover rounded-md group-hover:scale-105'
                                />
                                <div className='flex flex-col justify-between w-full group-hover:scale-105'>
                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-gray-500'>{event.date}</span>
                                        <Link href="/" className='hover:translate-x-1 transition-all'>
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <h3 className='font-semibold text-lg'>{event.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default RecentEvent;
