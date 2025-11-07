import React from "react";
import HeroSection from "../../components/home/HeroSection";
import BigStory from "../../components/blog/BigStory";
import RecentBlog from "../../components/blog/RecentBlogs";
import img1 from "public/images/img1.png";
import img2 from "public/images/img2.png";

const page = () => {
  return (
    <div className="font-poppins min-h-screen">
      <HeroSection
        title="Engineering the Future, One Student at a Time"
        highlight="One Student"
        images={[img2.src, img1.src, img2.src]}
      />
      <BigStory />
      <RecentBlog />
    </div>
  );
};

export default page;
