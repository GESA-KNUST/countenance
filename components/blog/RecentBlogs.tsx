"use client";
import React from "react";
import BlogCard from "./BlogCard";
import SkeletonLoadingCard from "./SkeletonLoadingCard";
import useBlogCollection from "@/hooks/useBlogCollection";

const RecentBlogs = () => {
  const {data, isLoading, isError} = useBlogCollection()

  return (
    <div className="md:px-page-x lg:py-page-y px-page-sx font-poppins my-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <h1 className="font-open_sans text-2xl font-bold">Recent Blog Posts</h1>
        {isLoading && <SkeletonLoadingCard />}
        {isError && <p className="font-bold text-red-500">Something went wrong</p>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 my-10 gap-x-20 gap-y-10">
          {data?.map((data) => (
            <BlogCard
              key={data._id}
              headerImg={data.headerImage}
              slug={data.slug}
              author={data.author.authorProfilePicture}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;
