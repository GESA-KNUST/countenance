const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280, 1600, 2048];
const DEFAULT_QUALITY = 85;

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width?: number;
  height?: number;
}

function isContentful(url: string) {
  return url.includes("images.ctfassets.net") || url.includes("//images.ctfassets.net");
}

function absolute(url: string) {
  return url.startsWith("//") ? `https:${url}` : url;
}

export function contentfulImage(
  url: string,
  options: {
    widths?: number[];
    quality?: number;
    intrinsicWidth?: number | null;
    intrinsicHeight?: number | null;
    aspect?: number;
    focus?: "center" | "face" | "faces" | "top";
  } = {}
): ResponsiveImage {
  const base = absolute(url);
  const quality = options.quality ?? DEFAULT_QUALITY;
  const intrinsic = options.intrinsicWidth ?? null;

  if (!isContentful(base)) {
    return { src: base, srcSet: "" };
  }

  const at = (width: number) => {
    const params = new URLSearchParams({
      w: String(width),
      fm: "webp",
      q: String(quality),
    });
    if (options.aspect) {
      params.set("h", String(Math.round(width / options.aspect)));
      params.set("fit", "fill");
      params.set("f", options.focus ?? "center");
    }
    return `${base}?${params.toString()}`;
  };

  const candidates = (options.widths ?? DEFAULT_WIDTHS).filter(
    (width) => !intrinsic || width < intrinsic
  );
  const widths = [...new Set(intrinsic ? [...candidates, intrinsic] : candidates)].sort(
    (a, b) => a - b
  );

  const largest = widths[widths.length - 1] ?? 1280;
  const displayWidth = Math.min(largest, 1600);

  return {
    src: at(displayWidth),
    srcSet: widths.map((width) => `${at(width)} ${width}w`).join(", "),
    width: options.intrinsicWidth ?? undefined,
    height: options.intrinsicHeight ?? undefined,
  };
}
