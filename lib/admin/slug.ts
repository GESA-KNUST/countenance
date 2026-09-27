export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['‘’“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function buildSlug(parts: (string | null | undefined)[]) {
  return parts
    .filter((part): part is string => typeof part === "string" && part.trim() !== "")
    .map(slugify)
    .filter(Boolean)
    .join("-");
}
