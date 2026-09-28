const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export interface OgImageEntry {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
}

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
