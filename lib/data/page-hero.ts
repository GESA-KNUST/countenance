import { gql } from "graphql-request";
import { contentfulClient, requestTolerant } from "../contentful-client";
import { LogError } from "../logger";

export type PageHeroKey =
  | "home"
  | "gallery"
  | "department"
  | "team"
  | "executives"
  | "contact-us";

export interface PageHeroAsset {
  url: string;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  contentType: string | null;
}

export interface PageHero {
  images: string[];
  mobileImages: string[];
  ogImage: PageHeroAsset | null;
}

interface PageHeroResponse {
  pageHeroCollection: {
    items: {
      pageKey: string;
      imagesCollection: { items: (PageHeroAsset | null)[] } | null;
      mobileImagesCollection: { items: (PageHeroAsset | null)[] } | null;
      ogImage: PageHeroAsset | null;
    }[];
  };
}

const ASSET_FIELDS = `url
      title
      description
      width
      height
      contentType`;

export const GET_PAGE_HERO = gql`
  query PageHero($pageKey: String!) {
    pageHeroCollection(where: { pageKey: $pageKey }, limit: 1) {
      items {
        pageKey
        imagesCollection(limit: 10) {
          items {
            ${ASSET_FIELDS}
          }
        }
        mobileImagesCollection(limit: 10) {
          items {
            ${ASSET_FIELDS}
          }
        }
        ogImage {
          ${ASSET_FIELDS}
        }
      }
    }
  }
`;

export const PAGE_HERO_FALLBACKS: Record<PageHeroKey, PageHero> = {
  home: {
    images: ["/images/img1.png", "/images/home/home-1.jpg", "/images/home/home-4.jpg"],
    mobileImages: [],
    ogImage: {
      url: "/images/executive/executivehero-1.jpg",
      title: "GESA-KNUST | Ghana Engineering Students Association",
      description: null,
      width: 1200,
      height: 630,
      contentType: "image/jpeg",
    },
  },
  gallery: {
    images: [
      "/images/gallery/gallery-1.jpg",
      "/images/gallery/gallery-2.jpeg",
      "/images/gallery/gallery-3.JPG",
    ],
    mobileImages: [],
    ogImage: null,
  },
  department: {
    images: ["/images/dept/dept-3.jpg", "/images/dept/dept-2.jpeg", "/images/dept/dept-1.jpeg"],
    mobileImages: [],
    ogImage: null,
  },
  team: {
    images: [
      "/images/Team/Team-1.png",
      "/images/Team/Team-2.png",
      "/images/Team/Team-3.png",
      "/images/Team/Team-4.png",
      "/images/Team/Team-5.png",
    ],
    mobileImages: [
      "/images/Team/teammobile1.png",
      "/images/Team/teammobile-2.png",
      "/images/Team/teammobile-3.png",
      "/images/Team/teammobile-4.png",
      "/images/Team/teammobile-5.png",
    ],
    ogImage: {
      url: "/images/Team/Team-1.png",
      title: "GESA Development Team",
      description: null,
      width: 1626,
      height: 1080,
      contentType: "image/png",
    },
  },
  executives: {
    images: [
      "/images/executive/executivehero-1.jpg",
      "/images/executive/executivehero-2.jpg",
      "/images/executive/executivehero-3.png",
    ],
    mobileImages: [
      "/images/executive/executiveimage-1.png",
      "/images/executive/executiveimage-2.png",
      "/images/executive/executiveimage-3.jpg",
    ],
    ogImage: null,
  },
  "contact-us": {
    images: ["/images/img2.png", "/images/img1.png", "/images/img2.png"],
    mobileImages: [],
    ogImage: null,
  },
};

export function resolvePageHero(data: PageHeroResponse | null, pageKey: PageHeroKey): PageHero {
  const fallback = PAGE_HERO_FALLBACKS[pageKey];
  const entry = data?.pageHeroCollection?.items?.[0];
  if (!entry) return fallback;

  const urls = (items: (PageHeroAsset | null)[] | undefined) =>
    (items ?? []).filter((a): a is PageHeroAsset => Boolean(a?.url)).map((a) => a.url);

  const images = urls(entry.imagesCollection?.items);
  const mobileImages = urls(entry.mobileImagesCollection?.items);

  return {
    images: images.length > 0 ? images : fallback.images,
    mobileImages: mobileImages.length > 0 ? mobileImages : fallback.mobileImages,
    ogImage: entry.ogImage?.url ? entry.ogImage : fallback.ogImage,
  };
}

export async function getPageHero(pageKey: PageHeroKey): Promise<PageHero> {
  try {
    const data = await requestTolerant<PageHeroResponse>(GET_PAGE_HERO, { pageKey });
    return resolvePageHero(data, pageKey);
  } catch (error) {
    LogError("[getPageHero] falling back to bundled images", pageKey, error);
    return PAGE_HERO_FALLBACKS[pageKey];
  }
}

export async function fetchPageHero(pageKey: PageHeroKey): Promise<PageHero> {
  try {
    const data = await contentfulClient.request<PageHeroResponse>(GET_PAGE_HERO, { pageKey });
    return resolvePageHero(data, pageKey);
  } catch (error) {
    LogError("[fetchPageHero] falling back to bundled images", pageKey, error);
    return PAGE_HERO_FALLBACKS[pageKey];
  }
}

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function ogImageUrl(url: string) {
  if (!url.includes("images.ctfassets.net")) return url;
  const params = new URLSearchParams({
    w: String(OG_WIDTH),
    h: String(OG_HEIGHT),
    fit: "fill",
    f: "face",
    fm: "jpg",
    q: "80",
  });
  return `${url}?${params.toString()}`;
}

export function ogImageMetadata(hero: PageHero, alt: string) {
  if (!hero.ogImage?.url) return [];

  const isContentful = hero.ogImage.url.includes("images.ctfassets.net");
  return [
    {
      url: ogImageUrl(hero.ogImage.url),
      width: isContentful ? OG_WIDTH : hero.ogImage.width ?? OG_WIDTH,
      height: isContentful ? OG_HEIGHT : hero.ogImage.height ?? OG_HEIGHT,
      alt: hero.ogImage.description?.trim() || alt,
      type: isContentful ? "image/jpeg" : hero.ogImage.contentType ?? "image/jpeg",
    },
  ];
}
