"use client";
import React from "react";
import BlogCard from "./BlogCard";
import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/lib/contentful-client";
import { gql } from "graphql-request";

interface ItemsProps {
  _id: string;
  slug: string;
  title: string;
  headerImage: {
    description: string;
    url: string;
  };
  author: {
    name: string;
    authorProfilePicture: {
      description: string;
      title: string;
      url: string;
    };
  };
}

interface Props {
  blogPostCollection: {
    items: ItemsProps[];
  };
}

const GET_POSTS = gql`
  query BlogPostCollection {
    blogPostCollection {
      items {
        headerImage {
          description
          url
        }
        slug
        title
        author {
          name
          authorProfilePicture {
            description
            title
            url
          }
        }
        _id
      }
    }
  }
`;

const RecentBlogs = () => {
  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const data = await contentfulClient.request<Props>(GET_POSTS);
      return data.blogPostCollection.items;
    },
  });

  return (
    <div className="md:px-page-x lg:py-page-y px-page-sx font-poppins my-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <h1 className="font-open_sans text-2xl font-bold">Recent Blog Posts</h1>
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
