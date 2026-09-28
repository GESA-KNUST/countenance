import { Suspense } from 'react';
import BlogContent from './BlogContent';
import { Metadata } from 'next';
import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import StarSpinner from '@/components/ui/StarSpinner';
import { LogError } from '@/lib/logger';
import ContributeNudge from '@/components/blog/ContributeNudge';
import { currentWriter } from '@/lib/contribute/session';
import { ogImage } from '@/lib/data/og-image';

type Props = {
  params: Promise<{ slug: string }>
}

interface BlogMetaPost {
  title?: string;
  hook?: string;
  headerImage?: { url?: string; description?: string } | null;
  author?: { name?: string } | null;
}

interface BlogMetaResponse {
  blogPostCollection: { items: BlogMetaPost[] };
}

function firstName(name: string | undefined | null) {
  return (name ?? '').trim().split(/\s+/)[0] ?? '';
}

const GET_BLOG_BY_SLUG = gql`
    query GetBlogBySlug($slug: String!) {
        blogPostCollection(where: { slug: $slug }, limit: 1) {
            items {
                title
                headerImage {
                    url
                    description
                }
                hook
                author {
                    name
                }
            }
        }
    }
`;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug: raw } = await props.params;
  const slug = decodeURIComponent(raw);

  if (!slug) {
    return {
      title: 'Blog & News',
    };
  }

  try {
    const data = await contentfulClient.request<BlogMetaResponse>(GET_BLOG_BY_SLUG, { slug });
    const post = data.blogPostCollection.items[0];

    if (!post) {
      return {
        title: 'Blog Post Not Found',
      };
    }

    const title = post.title ?? 'Blog & News';
    const writer = firstName(post.author?.name);

    const description = writer ? `By ${writer} · ${post.hook ?? ''}`.trim() : (post.hook ?? '');
    const share = ogImage(post.headerImage?.url, post.headerImage?.description || title);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: share,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: share.map((image) => image.url),
      },
    }
  } catch (error) {
    LogError('Error generating blog metadata:', error);
    return {
      title: 'Blog & News',
    };
  }
}

export default async function Page(props: Props) {
  const { slug } = await props.params;

  const writer = await currentWriter();

  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><StarSpinner /></div>}>
        <BlogContent slug={decodeURIComponent(slug)} />
      </Suspense>
      {!writer && <ContributeNudge />}
    </>
  );
}
