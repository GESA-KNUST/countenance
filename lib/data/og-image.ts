const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export interface OgImageEntry {
  url: string;
  width: number;
  height: number;
  alt: string;
  type: string;
}

interface OgOptions {
  focus?: "face" | "center";
  /**
   * Letterbox the picture on white instead of cropping it. A logo cropped to
   * the wide share shape loses its edges, so those pass this.
   */
  contain?: boolean;
}

export function ogImage(
  url: string | null | undefined,
  alt: string,
  options: OgOptions | "face" | "center" = {}
): OgImageEntry[] {
  const settings: OgOptions = typeof options === "string" ? { focus: options } : options;
  const focus = settings.focus ?? "center";
  if (!url) return [];

  const base = url.startsWith("//") ? `https:${url}` : url;
  if (!base.includes("images.ctfassets.net")) {
    return [{ url: base, width: OG_WIDTH, height: OG_HEIGHT, alt, type: "image/jpeg" }];
  }

  const params = new URLSearchParams({
    w: String(OG_WIDTH),
    h: String(OG_HEIGHT),
    fm: "jpg",
    q: "80",
  });

  if (settings.contain) {
    params.set("fit", "pad");
    params.set("bg", "rgb:ffffff");
  } else {
    params.set("fit", "fill");
    params.set("f", focus);
  }

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
