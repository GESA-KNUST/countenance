export function blogHref(slug: string | null | undefined): string | null {
  const trimmed = typeof slug === "string" ? slug.trim() : "";
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
  return `/blog/${encodeURIComponent(trimmed)}`;
}
