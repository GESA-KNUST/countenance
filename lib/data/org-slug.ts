const clean = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");


export function orgSlug(name: string | null | undefined, abbreviation?: string | null): string {
  const short = (abbreviation ?? "").trim();
  if (short) return clean(short);

  const inName = (name ?? "").trim().match(/\(([A-Za-z]{2,12})\)\s*$/);
  if (inName) return clean(inName[1]);

  return clean(name ?? "");
}

export function matchesOrgSlug(
  slug: string,
  name: string | null | undefined,
  abbreviation?: string | null
): boolean {
  const wanted = clean(slug);
  return wanted !== "" && orgSlug(name, abbreviation) === wanted;
}
