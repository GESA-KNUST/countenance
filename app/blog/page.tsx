import BigStory from '../../components/blog/BigStory'
import RecentBlog from '../../components/blog/RecentBlogs'
import img1 from "public/images/img1.webp";
import img2 from "public/images/img2.webp";
import HeroSection from '@/components/home/HeroSection';
import BlogContribute from '@/components/blog/BlogContribute';
import { getBlogsSafe } from '@/lib/data/blog';
import { blogListSchema } from '@/lib/seo/blog-schema';

const BlogPage = async () => {
  const posts = await getBlogsSafe();

  return (
    <div className='font-poppins min-h-screen'>
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema(posts)) }}
        />
      )}

      <HeroSection
        title="Explore Our Latest Blog Posts"
        highlight="Latest"
        text="Explore insights, innovations, and student experiences from the heart of KNUST's engineering community."
        images={[img2.src, img1.src, img2.src]}
        button={false}
      />
      <BigStory initialPosts={posts} />
      <RecentBlog initialPosts={posts} />
      <BlogContribute />
    </div>
  )
}

export default BlogPage;
