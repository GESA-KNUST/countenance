import { gql } from "graphql-request";
import { requestTolerant } from "../contentful-client";
import { LogError } from "../logger";
import type { EmbeddedAsset } from "../richTextOptions";

export interface ExecutiveImage {
  title: string | null;
  description: string | null;
  url: string;
}

export interface Executive {
  sys: { id: string; publishedAt?: string | null };
  fullName: string;
  executivePositionHeld: string;
  academicYear: string;
  primarySocialLink: string | null;
  officialImage: ExecutiveImage | null;
  slug: string | null;
  programmeOfStudy: string | null;
  quote: string | null;
  bio: { json: unknown; links?: { assets: { block: (EmbeddedAsset | null)[] } } } | null;
  achievements: string[] | null;
  portfolioImagesCollection: { items: (ExecutiveImage | null)[] } | null;
  portfolioLink: string | null;
  linkedInUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
  email: string | null;
}

export const EXECUTIVE_LIST_FIELDS = `sys { id publishedAt }
        fullName
        executivePositionHeld
        academicYear
        primarySocialLink
        officialImage {
          title
          description
          url
        }
        slug
        programmeOfStudy
        quote
        bio { json }`;

export const EXECUTIVE_DETAIL_FIELDS = `${EXECUTIVE_LIST_FIELDS}
        bio {
          json
          links {
            assets {
              block {
                sys { id }
                url
                title
                description
                width
                height
              }
            }
          }
        }
        achievements
        portfolioImagesCollection(limit: 12) {
          items {
            title
            description
            url
          }
        }
        portfolioLink
        linkedInUrl
        instagramUrl
        xUrl
        email`;

export function hasProfile(executive: Executive) {
  return Boolean(
    hasBioContent(executive) || executive.quote?.trim() || executive.programmeOfStudy?.trim()
  );
}

export function hasBioContent(executive: Executive) {
  const document = executive.bio?.json as { content?: unknown[] } | undefined;
  return Boolean(document?.content && document.content.length > 0);
}

export function executiveSlug(executive: Executive) {
  if (executive.slug) return executive.slug;

  const name = executive.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const year = (executive.academicYear ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (name && year) return `${name}-${year}`;
  if (name) return name;
  return executive.sys.id;
}

export function sortAcademicYears(years: string[]) {
  const startYear = (year: string) => Number(year.match(/\d{4}/)?.[0] ?? 0);
  return [...years].sort((a, b) => startYear(b) - startYear(a) || b.localeCompare(a));
}


export function currentAcademicYear(executives: Executive[]): string | null {
  return sortAcademicYears([...new Set(executives.map((executive) => executive.academicYear))])[0] ?? null;
}

export function academicYearStart(year: string | null | undefined): number | null {
  const match = (year ?? "").match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

export function academicYearRange(year: string | null | undefined) {
  const start = academicYearStart(year);
  if (!start) return null;
  return { startDate: String(start), endDate: String(start + 1) };
}

export function isCurrentYear(year: string | null | undefined, current: string | null) {
  return Boolean(year && current && year === current);
}

export function positionLabel(executive: Executive, current: string | null) {
  const position = executive.executivePositionHeld?.trim() || "Executive";
  return isCurrentYear(executive.academicYear, current) ? position : `Former ${position}`;
}

export function tenureSentence(executive: Executive, current: string | null) {
  const position = executive.executivePositionHeld?.trim() || "an executive";
  const year = executive.academicYear;

  return isCurrentYear(year, current)
    ? `${executive.fullName} is the ${position} of GESA-KNUST for the ${year} academic year.`
    : `${executive.fullName} served as ${position} of GESA-KNUST during the ${year} academic year.`;
}

export function executivesForYear(executives: Executive[], year: string | null) {
  return year ? executives.filter((executive) => executive.academicYear === year) : [];
}

export function executiveCountsByYear(executives: Executive[]) {
  const counts: Record<string, number> = {};
  for (const executive of executives) {
    counts[executive.academicYear] = (counts[executive.academicYear] ?? 0) + 1;
  }
  return counts;
}

const GET_ALL = gql`
  query AllExecutives {
    executiveCollection(limit: 200, order: [order_ASC]) {
      items {
        ${EXECUTIVE_LIST_FIELDS}
      }
    }
  }
`;

const GET_ONE = gql`
  query OneExecutive($id: String!) {
    executive(id: $id) {
      ${EXECUTIVE_DETAIL_FIELDS}
    }
  }
`;

export async function getExecutives(): Promise<Executive[]> {
  try {
    const data = await requestTolerant<{
      executiveCollection: { items: Executive[] };
    }>(GET_ALL);
    return data.executiveCollection.items ?? [];
  } catch (error) {
    LogError("[getExecutives]", error);
    return [];
  }
}

export async function getExecutiveBySlug(slug: string): Promise<Executive | null> {
  const executives = await getExecutives();
  const match = executives.find((executive) => executiveSlug(executive) === slug);
  if (!match) return null;

  try {
    const data = await requestTolerant<{ executive: Executive | null }>(GET_ONE, {
      id: match.sys.id,
    });
    return data.executive ?? match;
  } catch (error) {
    LogError("[getExecutiveBySlug] detail fetch failed", slug, error);
    return match;
  }
}
