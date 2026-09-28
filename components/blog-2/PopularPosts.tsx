'use client';
import Image from 'next/image';
import { blogHref } from '@/lib/data/blog-link';
import { ctfSrc } from '@/lib/contentful-src';

import { Share2 } from 'lucide-react';
import { LogError } from '@/lib/logger';
import { usePostHog } from 'posthog-js/react';
import EmptyState from '../events/EmptyState';
import { FileText } from 'lucide-react';
import type { Blog } from '@/hooks/useBlogCollection';

interface SimplifiedBlogCardProps {
    post: Blog;
    onPostSelect: (post: Blog) => void;
}

const SimplifiedBlogCard = ({ post, onPostSelect }: SimplifiedBlogCardProps) => {
    const posthog = usePostHog();

    return (
        <div
            className="h-[116px] w-full max-w-sm shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex flex-row overflow-hidden rounded-xl border border-gray-50 relative group"
            onClick={() => onPostSelect(post)}
        >
            <div className="relative w-28 h-full shrink-0">
                <Image
                    src={ctfSrc(post.headerImage.url, 240)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            <div className="flex flex-col justify-center p-4 relative w-full">
                <p className='text-sm text-[#FFBE00] font-bold '>Blog</p>
                <h3 className='text-lg font-bold text-foreground line-clamp-2 font-header pr-6'>{post.title}</h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}${blogHref(post.slug) ?? '/blog'}`;
                        if (navigator.share) {
                            navigator.share({
                                title: post.title,
                                text: `Check out this blog post: ${post.title}`,
                                url: url,
                            }).catch((error) => {
                                LogError('Error sharing', error);
                                posthog?.captureException(error);
                            });
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
};

interface PopularPostsProps {
    allPosts: Blog[] | undefined;
    onPostSelect: (post: Blog) => void;
    currentSlug?: string;
    authorName?: string;
}

const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-balance text-2xl font-bold text-muted-foreground/60 text-center xl:text-left font-header">
        {children}
    </h2>
);

const PopularPosts = ({ allPosts, onPostSelect, currentSlug, authorName }: PopularPostsProps) => {
    if (!allPosts || allPosts.length === 0) {
        return (
            <div className="w-[361px] flex flex-col items-center xl:items-start gap-2.5 xl:mt-4">
                <SidebarHeading>Popular Posts</SidebarHeading>
                <div className="w-full py-8">
                    <EmptyState
                        title="No Posts Yet"
                        message="Check back soon for new articles."
                        showHomeButton={false}
                        icon={FileText}
                    />
                </div>
            </div>
        );
    }

    const others = allPosts.filter((post) => post.slug !== currentSlug);

    const byAuthor = authorName
        ? others.filter((post) => post.author?.name === authorName).slice(0, 3)
        : [];

    const shown = new Set(byAuthor.map((post) => post.slug));
    const popular = others.filter((post) => !shown.has(post.slug)).slice(0, 5);

    const firstName = (authorName ?? '').trim().split(/\s+/)[0];

    return (
        <div className="w-[361px] flex flex-col items-center xl:items-start gap-10 xl:mt-4">
            {byAuthor.length > 0 && (
                <div className="flex flex-col items-center xl:items-start gap-6 w-full">
                    <SidebarHeading>More from {firstName}</SidebarHeading>
                    <div className="flex flex-col gap-6 w-full">
                        {byAuthor.map((post) => (
                            <SimplifiedBlogCard
                                key={post.slug}
                                post={post}
                                onPostSelect={onPostSelect}
                            />
                        ))}
                    </div>
                </div>
            )}

            {popular.length > 0 && (
                <div className="flex flex-col items-center xl:items-start gap-6 w-full">
                    <SidebarHeading>Popular Posts</SidebarHeading>
                    <div className="flex flex-col gap-6 w-full">
                        {popular.map((post) => (
                            <SimplifiedBlogCard
                                key={post.slug}
                                post={post}
                                onPostSelect={onPostSelect}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopularPosts;
