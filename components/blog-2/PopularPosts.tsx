'use client';
import Image from 'next/image';
import { Skeleton } from '../../components/ui/skeleton';

import { Share2 } from 'lucide-react';

const SimplifiedBlogCard = ({ post, onPostSelect }) => (
    <div
        className="h-[116px] w-full max-w-sm shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex flex-row overflow-hidden rounded-xl border border-gray-50 relative group"
        onClick={() => onPostSelect(post)}
    >
        <div className="relative w-28 h-full shrink-0">
            <Image
                src={post.headerImage.url}
                alt={post.title}
                fill
                className="object-cover"
            />
        </div>
        <div className="flex flex-col justify-center p-4 relative w-full">
            <p className='text-sm text-[#FFBE00] font-bold '>Blog</p>
            <h3 className='text-lg font-bold text-foreground line-clamp-2 font-header pr-6'>{post.title}</h3>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const url = `${window.location.origin}/blog-2?slug=${post.slug}`;
                    if (navigator.share) {
                        navigator.share({
                            title: post.title,
                            text: `Check out this blog post: ${post.title}`,
                            url: url,
                        }).catch((error) => { });
                    } else {
                        navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                    }
                }}
                className="absolute bottom-2 right-2 p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-primary z-10"
                title="Share"
            >
                <Share2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const PopularPosts = ({ allPosts, onPostSelect }) => {

    if (!allPosts) {
        return (
            <div className="w-[361px] flex flex-col items-center xl:items-start gap-2.5 xl:mt-78">
                <h2 className="text-3xl font-bold text-muted-foreground/50 text-center xl:text-left font-header">
                    Popular Posts
                </h2>
                <div className="flex flex-col gap-6 w-full">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-[116px] w-full max-w-sm shadow-lg flex flex-row overflow-hidden">
                            <Skeleton className="h-full w-28" />
                            <div className="flex flex-col justify-center p-4 gap-2 w-full">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-[361px] flex flex-col items-center xl:items-start gap-6 xl:mt-78">
            <h2 className="text-3xl font-bold text-muted-foreground/50 text-center xl:text-left font-header">
                Popular Posts
            </h2>

            <div className="flex flex-col gap-6 w-full">
                {allPosts?.slice(0, 5).map((post) => (
                    <SimplifiedBlogCard
                        key={post.slug}
                        post={post}
                        onPostSelect={onPostSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default PopularPosts;
