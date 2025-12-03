'use client';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import SkeletonLoading from './SkeletonLoading';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const MainContent = ({ selectedPost }) => {

    if (!selectedPost) return <SkeletonLoading />;

    const getTags = () => {
        if (!selectedPost.tags) return [];
        if (Array.isArray(selectedPost.tags)) return selectedPost.tags;
        if (typeof selectedPost.tags === 'object' && Array.isArray(selectedPost.tags.tags)) {
            return selectedPost.tags.tags;
        }
        return [];
    };

    const tags = getTags();

  return (
    <div className="w-full lg:w-2/3">
        <section className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <p
              className="font-bold text-sm uppercase text-primary"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {selectedPost.author.name}
            </p>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <div className="relative mb-4">
            <h1 className="text-[32px] md:text-[40px] font-bold leading-tight text-foreground max-w-3xl">
              {selectedPost.title}
            </h1>
            {selectedPost.hook && <p className="text-lg text-muted-foreground mt-4">{selectedPost.hook}</p>}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.map((tag, index) => {
                const tagContent = typeof tag === 'string' ? tag : tag.title;
                if (!tagContent) return null;
                return (
                    <span key={index} className="bg-primary/10 text-primary text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {tagContent}
                    </span>
                );
            })}
          </div>
          <div className="relative w-[50px] h-1 bg-primary mt-4 mx-auto">
            <div className="absolute top-0 right-full mr-2 w-1 h-1 bg-primary rounded-full"></div>
          </div>
        </section>
        <Image src={selectedPost.headerImage.url} alt={selectedPost.headerImage.description || selectedPost.title} width={800} height={574} className="w-full h-auto mb-8" />
            
        <div className="text-foreground text-lg leading-8">{documentToReactComponents(selectedPost.blogContent.json)}</div>

        <div className="flex items-center gap-4 mt-4">
        <Image src="/images/logo.svg" alt="logo" width={100} height={24} />
        <div className="h-10">
            <Separator orientation="vertical" className="w-full" />
        </div>
        <div className="flex gap-2">
            <Link href="#">
                <Image src="/images/fb2.svg" alt="Facebook" width={40} height={40} />
            </Link>
            <Link href="#">
                <Image src="/images/twitter.svg" alt="Twitter" width={40} height={40} />
            </Link>
            <Link href="#">
                <Image src="/images/yt.svg" alt="YouTube" width={40} height={40} />
            </Link>
            <Link href="#">
                <Image src="/images/linkedin2.svg" alt="LinkedIn" width={40} height={40} />
            </Link>
        </div>
        </div>
    </div>
  )
}

export default MainContent
