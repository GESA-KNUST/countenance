const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export interface OgImageEntry {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
}

/**
 * Social platforms want a wide JPEG at a predictable size, so any Contentful
 * asset is cropped to the card shape rather than sent at its own dimensions.
 * WebP is deliberately avoided here: WhatsApp previews are unreliable with it.
 */
export function ogImage(
  url: string | null | undefined,
  alt: string,
  focus: "face" | "center" = "center"
): OgImageEntry[] {
  if (!url) return [];

  const base = url.startsWith("//") ? `https:${url}` : url;
  if (!base.includes("images.ctfassets.net")) {
    return [{ url: base, width: OG_WIDTH, height: OG_HEIGHT, alt, type: "image/jpeg" }];
  }

  const params = new URLSearchParams({
    w: String(OG_WIDTH),
    h: String(OG_HEIGHT),
    fit: "fill",
    f: focus,
    fm: "jpg",
    q: "80",
  });

  return [
    {
      url: `${base}?${params.toString()}`,
      width: OG_WIDTH,
      height: OG_HEIGHT,
      alt,
      type: "image/jpeg",
    },
  ];
}
