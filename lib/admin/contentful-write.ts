import { LOCALE, type AssetLinkField, assetLink, cma, linkIds } from "./cma";
import { assetUrls } from "./assets";

const CONTENT_TYPE_ID = "pageHero";

export const MAX_IMAGES_PER_STRIP = 10;

export interface HeroImage {
  id: string;
  url: string;
}

export interface HeroEntry {
  images: HeroImage[];
  mobileImages: HeroImage[];
}

interface HeroEntryItem {
  fields?: {
    pageKey?: Record<string, string | undefined>;
    images?: Record<string, AssetLinkField[] | undefined>;
    mobileImages?: Record<string, AssetLinkField[] | undefined>;
  };
}

function withUrls(ids: string[], urls: Map<string, string>): HeroImage[] {
  return ids.filter((id) => urls.has(id)).map((id) => ({ id, url: urls.get(id) as string }));
}

export async function readHeroEntry(pageKey: string): Promise<HeroEntry> {
  const entry = await cma(`/entries/page-hero-${pageKey}`);
  if (!entry) return { images: [], mobileImages: [] };

  const imageIds = linkIds(entry.fields?.images?.[LOCALE]);
  const mobileIds = linkIds(entry.fields?.mobileImages?.[LOCALE]);
  const urls = await assetUrls([...new Set([...imageIds, ...mobileIds])]);

  return { images: withUrls(imageIds, urls), mobileImages: withUrls(mobileIds, urls) };
}

export async function readAllHeroEntries(): Promise<Record<string, HeroEntry>> {
  const entries = await cma(`/entries?content_type=${CONTENT_TYPE_ID}&limit=100`);
  const items: HeroEntryItem[] = entries?.items ?? [];
  if (items.length === 0) return {};

  const desktopOf = (entry: HeroEntryItem) => linkIds(entry.fields?.images?.[LOCALE]);
  const phoneOf = (entry: HeroEntryItem) => linkIds(entry.fields?.mobileImages?.[LOCALE]);

  const allIds = [...new Set(items.flatMap((entry) => [...desktopOf(entry), ...phoneOf(entry)]))];
  const urls = await assetUrls(allIds);

  const result: Record<string, HeroEntry> = {};
  for (const entry of items) {
    const pageKey = entry.fields?.pageKey?.[LOCALE];
    if (typeof pageKey !== "string") continue;
    result[pageKey] = {
      images: withUrls(desktopOf(entry), urls),
      mobileImages: withUrls(phoneOf(entry), urls),
    };
  }
  return result;
}

export async function saveHeroEntry(
  pageKey: string,
  imageIds: string[],
  mobileImageIds: string[]
) {
  const id = `page-hero-${pageKey}`;
  const existing = await cma(`/entries/${id}`);
  if (!existing) {
    throw new Error(`No Contentful entry for "${pageKey}" - it must be created first`);
  }

  const fields: Record<string, unknown> = {
    title: { [LOCALE]: existing.fields?.title?.[LOCALE] ?? pageKey },
    pageKey: { [LOCALE]: pageKey },
    images: { [LOCALE]: imageIds.map(assetLink) },
    mobileImages: { [LOCALE]: mobileImageIds.map(assetLink) },
  };
  if (imageIds.length > 0) {
    fields.ogImage = { [LOCALE]: assetLink(imageIds[0]) };
  }

  const saved = await cma(`/entries/${id}`, {
    method: "PUT",
    version: existing.sys.version,
    body: { fields },
  });

  const published = await cma(`/entries/${id}/published`, {
    method: "PUT",
    version: saved.sys.version,
  });
  if (!published?.sys?.publishedVersion) {
    throw new Error("Saved, but the page could not be published");
  }
}

export { isWriteConfigured } from "./cma";
export { assertPublishedAsset, uploadAsset } from "./assets";
