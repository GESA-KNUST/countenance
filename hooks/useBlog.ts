import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

import type { Document } from "@contentful/rich-text-types";

export interface BlogAsset {
  sys: { id: string };
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface BlogPost {
  headerImage: { title: string; url: string };
  slug: string;
  author: {
    name: string;
    authorProfilePicture: { url: string; title: string };
  };
  blogContent: {
    json: Document;
    links: {
      assets: {
        block: BlogAsset[];
        hyperlink: BlogAsset[];
      };
      entries: {
        inline: { sys: { id: string }; __typename: string }[];
      };
    };
  };
  hook: string;
  tags: { tags: string[] };
  title: string;
}

interface BlogPostResponse {
  blogPostCollection: {
    items: BlogPost[];
  };
}

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
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                description
                width
                height
              }
              hyperlink {
                sys {
                  id
                }
                url
                description
                width
                height
              }
            }
            entries {
              inline {
                sys {
                  id
                }
                __typename
              }
            }
          }
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
  return useFetchData({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const data = await contentfulClient.request<BlogPostResponse>(GET_BLOG_BY_SLUG, {
        where: { slug },
      });
      return data.blogPostCollection.items[0] ?? null;
    },
    enabled: !!slug,
  });
};
