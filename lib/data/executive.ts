import { gql } from "graphql-request";
import { contentfulDirect } from "../contentful-client";
import { LogError } from "../logger";
import type { EmbeddedAsset } from "../richTextOptions";

export interface ExecutiveImage {
  title: string | null;
  description: string | null;
  url: string;
}

export interface Executive {
  sys: { id: string };
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

export const EXECUTIVE_LIST_FIELDS = `sys { id }
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
  const fromName = executive.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fromName ? `${fromName}-${executive.sys.id.slice(0, 6)}` : executive.sys.id;
}

export function sortAcademicYears(years: string[]) {
  const startYear = (year: string) => Number(year.match(/\d{4}/)?.[0] ?? 0);
  return [...years].sort((a, b) => startYear(b) - startYear(a) || b.localeCompare(a));
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
    const data = await contentfulDirect.request<{
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
    const data = await contentfulDirect.request<{ executive: Executive | null }>(GET_ONE, {
      id: match.sys.id,
    });
    return data.executive ?? match;
  } catch (error) {
    LogError("[getExecutiveBySlug] detail fetch failed", slug, error);
    return match;
  }
}
