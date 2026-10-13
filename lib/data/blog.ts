import { gql } from "graphql-request";
import type { Document } from "@contentful/rich-text-types";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

export interface BlogAuthor {
  name: string;
  authorProfilePicture: {
    url: string;
    title: string;
  };
}

export interface Blog {
  title: string;
  slug: string;
  headerImage: {
    title: string;
    url: string;
  };
  author: BlogAuthor;
  hook: string;
  tags: {
    tags: string[];
  };
  datePublished: string;
  _id: string;
}

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
  datePublished?: string;
}

interface BlogListResponse {
  blogPostCollection: { items: Blog[] };
}

interface BlogPostResponse {
  blogPostCollection: { items: BlogPost[] };
}

const GET_BLOGS = gql`
  query BlogPosts {
    blogPostCollection(order: [order_ASC]) {
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
        hook
        tags {
          tags
        }
        title
        datePublished
        _id
      }
    }
  }
`;

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
        datePublished
      }
    }
  }
`;

export async function getBlogs(): Promise<Blog[]> {
  const data = await contentfulClient.request<BlogListResponse>(GET_BLOGS);
  return data.blogPostCollection.items ?? [];
}

export async function getBlogsSafe(): Promise<Blog[]> {
  try {
    return await getBlogs();
  } catch (error) {
    LogError("[getBlogs]", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;
  const data = await contentfulClient.request<BlogPostResponse>(GET_BLOG_BY_SLUG, {
    where: { slug },
  });
  return data.blogPostCollection.items[0] ?? null;
}

export async function getBlogPostSafe(slug: string): Promise<BlogPost | null> {
  try {
    return await getBlogPost(slug);
  } catch (error) {
    LogError("[getBlogPost]", slug, error);
    return null;
  }
}
