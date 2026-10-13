import { ctfSrc } from "../contentful-src";
import { blogHref } from "../data/blog-link";
import type { Blog, BlogPost } from "../data/blog";
import { ORGANIZATION_ID, ORGANIZATION_NAME, SITE_URL, absoluteUrl } from "./site";

const PUBLISHER = {
  "@id": ORGANIZATION_ID,
  "@type": "Organization",
  name: ORGANIZATION_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.png`,
  },
};

function postUrl(slug: string) {
  const href = blogHref(slug);
  return href ? absoluteUrl(href) : `${SITE_URL}/blog`;
}

export function articleSchema(post: BlogPost) {
  const url = postUrl(post.slug);
  const image = post.headerImage?.url
    ? ctfSrc(post.headerImage.url, 1200, { height: 630 })
    : undefined;
  const published = post.datePublished ? Date.parse(post.datePublished) : NaN;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.hook ? { description: post.hook } : {}),
    ...(image ? { image } : {}),
    ...(Number.isNaN(published)
      ? {}
      : {
          datePublished: new Date(published).toISOString(),
          dateModified: new Date(published).toISOString(),
        }),
    ...(post.author?.name
      ? { author: { "@type": "Person", name: post.author.name } }
      : { author: PUBLISHER }),
    publisher: PUBLISHER,
    ...(post.tags?.tags?.length ? { keywords: post.tags.tags.join(", ") } : {}),
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

export function blogListSchema(posts: Blog[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "GESA-KNUST Blog",
    url: `${SITE_URL}/blog`,
    publisher: PUBLISHER,
    blogPost: posts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: postUrl(post.slug),
      ...(post.hook ? { description: post.hook } : {}),
      ...(post.datePublished && !Number.isNaN(Date.parse(post.datePublished))
        ? { datePublished: new Date(post.datePublished).toISOString() }
        : {}),
      ...(post.author?.name ? { author: { "@type": "Person", name: post.author.name } } : {}),
    })),
  };
}
