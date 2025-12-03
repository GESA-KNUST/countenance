'use client';
import { useState } from 'react';
import BlogCard from '../../components/blog/BlogCard';
import { Skeleton } from '../../components/ui/skeleton';

const PopularPosts = ({ allPosts, onPostSelect }) => {
    const [visiblePosts, setVisiblePosts] = useState(9);

    const loadMore = () => {
        setVisiblePosts(prevVisiblePosts => prevVisiblePosts + 3);
    };

    if (!allPosts) {
        return (
            <div className="w-full xl:w-1/3 flex flex-col items-center xl:items-start gap-8 xl:mt-58">
                <h2 className="text-3xl font-bold text-muted-foreground/50 text-center xl:text-left">
                    Popular Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-8">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="h-full w-full max-w-sm shadow-lg p-5 flex justify-center rounded">
                            <div className="flex flex-col gap-5 w-full">
                                <Skeleton className="h-60 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <div className="flex">
                                    <Skeleton className="h-8 w-full" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="w-full flex flex-col gap-2">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full xl:w-1/3 flex flex-col items-center xl:items-start gap-8 xl:mt-78">
            <h2 className="text-3xl font-bold text-muted-foreground/50 text-center xl:text-left">
                Popular Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-8">
                {allPosts?.slice(0, visiblePosts).map((post) => (
                    <BlogCard 
                        key={post.slug} 
                        post={post}
                        slug={post.title} 
                        author={{
                            title: post.author.name,
                            url: post.author.authorProfilePicture.url,
                            description: post.author.authorProfilePicture.description
                        }}
                        headerImg={post.headerImage}
                        onPostSelect={onPostSelect}
                    />
                ))}
            </div>

            {allPosts && visiblePosts < allPosts.length && (
                <button onClick={loadMore} className="text-primary font-bold py-2 px-4 rounded-lg w-fit self-center xl:self-end">
                    Load More
                </button>
            )}
        </div>
    );
};

export default PopularPosts;
