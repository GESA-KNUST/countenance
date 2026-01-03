'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import MainContent from '../../components/blog-2/MainContent';
import PopularPosts from '../../components/blog-2/PopularPosts';
import useBlogCollection from '../../hooks/useBlogCollection';
import { useBlog } from '../../hooks/useBlog';

export default function BlogContent() {
  const { data: allPosts } = useBlogCollection();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSlug = searchParams.get('slug');
  const activeSlug = currentSlug || allPosts?.[0]?.slug;

  const { data: detailedPost } = useBlog(activeSlug || '');

  const handlePostSelect = (post) => {
    router.push(`?slug=${post.slug}`, { scroll: false });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white font-poppins">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-2 lg:px-8 pb-16">
        <div className="flex flex-col xl:flex-row gap-16">
          <MainContent selectedPost={detailedPost} />
          <PopularPosts allPosts={allPosts} onPostSelect={handlePostSelect} />
        </div>
      </div>
    </main>
  );
}
