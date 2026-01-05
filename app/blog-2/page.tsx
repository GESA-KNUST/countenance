import { Suspense } from 'react';
import BlogContent from './BlogContent';
import { Metadata, ResolvingMetadata } from 'next';
import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import StarSpinner from '@/components/ui/StarSpinner';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const GET_BLOG_BY_SLUG = gql`
    query GetBlogBySlug($slug: String!) {
        blogPostCollection(where: { slug: $slug }, limit: 1) {
            items {
                title
                headerImage {
                    url
                }
                hook
            }
        }
    }
`;

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const slug = searchParams.slug;

  if (!slug || Array.isArray(slug)) {
    return {
      title: 'Blog & News',
    };
  }

  try {
    const data: any = await contentfulClient.request(GET_BLOG_BY_SLUG, { slug });
    const post = data.blogPostCollection.items[0];

    if (!post) {
      return {
        title: 'Blog Post Not Found',
      };
    }

    return {
      title: post.title,
      description: post.hook,
      openGraph: {
        title: post.title,
        description: post.hook,
        images: [post.headerImage.url],
      },
    }
  } catch (error) {
    console.error(error);
    return {
      title: 'Blog & News',
    };
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><StarSpinner /></div>}>
      <BlogContent />
    </Suspense>
  );
}
