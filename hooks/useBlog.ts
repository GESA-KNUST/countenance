import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

const GET_BLOG_BY_SLUG = gql`
  query BlogPostCollection($where: BlogPostFilter) {
    blogPostCollection(where: $where, limit: 1) {
      items {
        headerImage {
          title
          url
        }
        slug
        author {
          name
          authorProfilePicture {
            url
            title
          }
        }
        blogContent {
          json
        }
        hook
        tags {
          tags
        }
        title
      }
    }
  }
`;

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const data = await contentfulClient.request(GET_BLOG_BY_SLUG, { 
        where: { slug } 
      });
      if (data.blogPostCollection.items.length === 0) {
          return null;
      }
      return data.blogPostCollection.items[0];
    },
  });
};
