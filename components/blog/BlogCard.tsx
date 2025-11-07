import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CardProps {
  slug: string;
  author: {
    title: string;
    url: string;
    description: string;
  };
  headerImg: {
    url: string;
    description: string;
  };
}

const BlogCard = ({ headerImg, slug, author }: CardProps) => {
  return (
    <div className="h-[580px] xl:w-[334px] lg:w-[300px] sm:w-[340px] w-full shadow-lg p-5 flex justify-center rounded cursor-pointer hover:scale-102 hover:rotate-1 transition-transform duration-300">
      <div className="flex flex-col gap-5">
        <div className="h-60 relative">
          <Image
            src={headerImg.url}
            alt={headerImg.description}
            className="w-full h-60 object-cover"
            fill
          />
        </div>
        <h1 className="font-semibold text-primary text-sm">Design</h1>
        <div className="flex">
          <h1 className="text-2xl font-bold font-open_sans">{slug}</h1>
          <ArrowUpRight />
        </div>
        <p className="text-text-gray">
          How do you create compelling presentations that wow your colleagues
          and impress your managers?
        </p>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full relative">
            <Image
              src={author.url}
              alt={author.description}
              className="h-full w-full object-cover rounded-full"
              fill
            />
          </div>
          <div>
            <h4 className="font-medium text-sm">{author.title}</h4>
            <p className="md:text-sm text-xs text-text-gray">
              1st October 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
