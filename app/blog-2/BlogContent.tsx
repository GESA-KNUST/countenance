'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainContent from '../../components/blog-2/MainContent';
import PopularPosts from '../../components/blog-2/PopularPosts';
import useBlogCollection from '../../hooks/useBlogCollection';

export default function BlogContent() {
  const { data: allPosts } = useBlogCollection();
  const [selectedPost, setSelectedPost] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get('slug');
    if (allPosts) {
      if (slug) {
        const post = allPosts.find((p) => p.slug === slug);
        setSelectedPost(post || allPosts[0]);
      } else {
        setSelectedPost(allPosts[0]);
      }
    }
  }, [searchParams, allPosts]);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white font-poppins">
       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-2 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row gap-16">
          <MainContent selectedPost={selectedPost} />
          <PopularPosts allPosts={allPosts} onPostSelect={handlePostSelect} />
        </div>
      </div>
    </main>
  );
}
