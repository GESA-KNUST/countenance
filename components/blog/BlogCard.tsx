import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../ui/StarSpinner";

interface CardProps {
  post: any;
  slug: string;
  author: {
    title: string;
    url: string;
    description?: string;
  };
  headerImg: {
    url: string;
    description?: string;
    title?: string;
  };
  onPostSelect?: (post: any) => void;
}

const BlogCard = ({ post, headerImg, slug, author, onPostSelect }: CardProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formattedDate = new Date(post.datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (onPostSelect) {
      setLoading(true);
      onPostSelect(post);
      router.push(`/blog-2?slug=${post.slug}`, { scroll: false });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setLoading(true);
      setTimeout(() => {
        router.push(`/blog-2?slug=${post.slug}`);
      }, 1000);
    }
  };

  return (
    <div onClick={handleClick}>
      <motion.div 
        className="h-[520px] lg:w-[300px] sm:w-[340px] w-full shadow-lg overflow-hidden flex flex-col cursor-pointer hover:scale-101 hover:rotate-1 transition-transform duration-300"
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Image */}
            <div className="h-60 relative shrink-0 rounded-t-sm">
              <Image
                src={headerImg.url}
                alt={headerImg.title || "Blog post header image"}
                className="w-full h-full object-cover rounded-t-sm"
                fill
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col grow">
              <div className="grow">
                <h1 className="font-semibold text-primary text-sm">Design</h1>
                <div className="flex mt-2 items-start">
                  <h1 className="text-2xl font-bold font-open_sans line-clamp-2">{slug}</h1>
                  <ArrowUpRight className="shrink-0 ml-1" />
                </div>
                <p className="text-text-gray mt-2 line-clamp-3">
                  {post.hook}
                </p>
              </div>

              {/* Author Info */}
              <div className="shrink-0 mt-4">
                <div className="flex gap-2 items-center">
                  <div className="h-10 w-10 relative">
                    <Image
                      src={author.url}
                      alt={author.title || "author image"}
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{author.title}</h4>
                    <p className="md:text-sm text-xs text-text-gray">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BlogCard;
