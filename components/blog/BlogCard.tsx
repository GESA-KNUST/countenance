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
  const formattedDate = new Date(post.datePublished).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
    <div className="h-full" onClick={handleClick}>
      <motion.div
        className="h-full flex flex-col bg-white overflow-hidden shadow-lg rounded-xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Image Container - Fixed height for alignment */}
            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-gray-100">
              <Image
                src={headerImg.url}
                alt={headerImg.title || "Blog post header image"}
                className="object-cover object-center w-full h-full transition-transform duration-500 hover:scale-105"
                width={600}
                height={350}
              />
            </div>
            {/* Content Container */}
            <div className="flex flex-col grow justify-between p-6">
              <div>
                <h3 className="font-header text-xl font-bold text-gray-900 leading-tight mb-3 line-clamp-3">
                  {slug}
                </h3>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 relative rounded-full overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={author.url}
                      alt={"author image"}
                      className="h-full w-full object-cover"
                      fill
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm text-gray-900 leading-none mb-1">
                      {author.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium">
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
