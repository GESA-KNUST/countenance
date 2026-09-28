import { CONTENTFUL_CACHE_TAG, CONTENTFUL_REVALIDATE_SECONDS } from "../contentful-client";
import { LogError } from "../logger";

const SPACE = process.env.CONTENTFUL_SPACE_ID ?? process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const TOKEN =
  process.env.CONTENTFUL_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

export async function getContentVersion(): Promise<string> {
  if (!SPACE || !TOKEN) return "0";

  const url =
    `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}/entries` +
    `?limit=1&order=-sys.updatedAt&select=sys.updatedAt`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: CONTENTFUL_REVALIDATE_SECONDS, tags: [CONTENTFUL_CACHE_TAG] },
    });
    if (!res.ok) return "0";

    const body = (await res.json()) as { items?: { sys?: { updatedAt?: string } }[] };
    const updated = body.items?.[0]?.sys?.updatedAt;
    return updated ? String(Date.parse(updated)) : "0";
  } catch (error) {
    LogError("[getContentVersion]", error);
    return "0";
  }
}
