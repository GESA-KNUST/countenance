const CONTENTFUL_HOST = "images.ctfassets.net";

interface Options {
  height?: number;
  focus?: "face" | "center";
  quality?: number;
}

export function ctfSrc(
  url: string | null | undefined,
  width: number,
  options: Options = {}
): string {
  if (!url) return "";

  const absolute = url.startsWith("//") ? `https:${url}` : url;
  if (!absolute.includes(CONTENTFUL_HOST)) return absolute;

  const [base, query = ""] = absolute.split("?");
  const params = new URLSearchParams(query);

  if (!params.has("w")) params.set("w", String(width));
  if (options.height && !params.has("h")) {
    params.set("h", String(options.height));
    if (!params.has("fit")) params.set("fit", "fill");
  }
  if (options.focus && !params.has("f")) params.set("f", options.focus);
  if (!params.has("fm")) params.set("fm", "webp");
  if (!params.has("q")) params.set("q", String(options.quality ?? 75));

  return `${base}?${params.toString()}`;
}
