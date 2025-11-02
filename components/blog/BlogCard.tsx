import Image from 'next/image';
import blogImg1 from '../../public/images/blogImg1.png'
import { ArrowUpRight } from 'lucide-react';
import blogAuthor from '../../public/images/author.jpg'

const BlogCard = () => {
    return (
        <div className='h-[580px] xl:w-[334px] lg:w-[300px] sm:w-[340px] w-full shadow-lg p-5 flex justify-center rounded cursor-pointer hover:scale-102 hover:rotate-1 transition-transform duration-300'>
            <div className='flex flex-col gap-5'>
                <div className='h-60'>
                    <Image src={blogImg1} alt='blogimg' className='w-full h-full object-cover' />
                </div>
                <h1 className='font-semibold text-primary text-sm'>Design</h1>
                <div className='flex'>
                    <h1 className='text-2xl font-bold font-open_sans'>UX review presentations</h1>
                    <ArrowUpRight/>
                </div>
                <p className='text-text-gray'>How do you create compelling presentations that wow your colleagues and impress your managers?</p>
                <div className='flex gap-2'>
                    <div className='h-10 w-10 rounded-full'>
                        <Image src={blogAuthor} alt='blogimg' className='h-full w-full object-cover rounded-full' />
                    </div>
                    <div>
                        <h4 className='font-medium text-sm'>Master Logical</h4>
                        <p className='md:text-sm text-xs text-text-gray'>1st October 2025</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;