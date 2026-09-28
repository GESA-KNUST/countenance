
const MAX_WORDS = 8;
const MAX_LENGTH = 60;

const FILLER = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "in",
  "is", "it", "of", "on", "or", "that", "the", "to", "with", "you", "your",
]);

function trimToWords(value: string) {
  const words = value.split("-").filter(Boolean);
  if (words.length === 0) return "";

  const useful =
    words.length > MAX_WORDS ? words.filter((word) => !FILLER.has(word)) : words;
  const kept = (useful.length > 0 ? useful : words).slice(0, MAX_WORDS);

  let slug = kept.join("-");
  while (slug.length > MAX_LENGTH && slug.includes("-")) {
    slug = slug.slice(0, slug.lastIndexOf("-"));
  }

  return slug.slice(0, MAX_LENGTH).replace(/^-+|-+$/g, "");
}

export function slugify(value: string) {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['‘’“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return trimToWords(cleaned);
}

export function buildSlug(parts: (string | null | undefined)[]) {
  return parts
    .filter((part): part is string => typeof part === "string" && part.trim() !== "")
    .map(slugify)
    .filter(Boolean)
    .join("-");
}

export function cleanSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2018\u2019\u201c\u201d]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}
