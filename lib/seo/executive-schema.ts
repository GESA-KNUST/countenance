import { ctfSrc } from "../contentful-src";
import {
  type Executive,
  academicYearRange,
  executiveSlug,
  hasProfile,
  isCurrentYear,
  tenureSentence,
} from "../data/executive";
import { ORGANIZATION_ID, ORGANIZATION_NAME, SITE_URL, absoluteUrl } from "./site";

const EXECUTIVES_URL = `${SITE_URL}/executives`;

function portrait(executive: Executive) {
  const url = executive.officialImage?.url;
  return url ? ctfSrc(url, 800, { height: 800, focus: "face" }) : undefined;
}

function profileUrl(executive: Executive) {
  return hasProfile(executive) ? absoluteUrl(`/executives/${executiveSlug(executive)}`) : undefined;
}

function sameAs(executive: Executive) {
  return [
    ...new Set(
      [
        executive.linkedInUrl,
        executive.instagramUrl,
        executive.xUrl,
        executive.portfolioLink,
        executive.primarySocialLink,
      ]
        .filter((link): link is string => Boolean(link?.trim()))
        .map((link) => link.trim().replace(/\/$/, ""))
    ),
  ];
}


export function currentMemberSchema(executives: Executive[], current: string | null) {
  return executives
    .filter((executive) => isCurrentYear(executive.academicYear, current))
    .map((executive) => ({
      "@type": "Person",
      name: executive.fullName,
      jobTitle: executive.executivePositionHeld,
      ...(profileUrl(executive) ? { url: profileUrl(executive) } : {}),
      ...(portrait(executive) ? { image: portrait(executive) } : {}),
    }));
}

export function currentExecutivesListSchema(executives: Executive[], current: string | null) {
  const serving = executives.filter((executive) =>
    isCurrentYear(executive.academicYear, current)
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${EXECUTIVES_URL}/#current-executives`,
    name: current
      ? `Current executives of GESA-KNUST (${current})`
      : "Current executives of GESA-KNUST",
    description: current
      ? `The executive body serving the Ghana Engineering Students Association at KNUST for the ${current} academic year.`
      : "The executive body serving the Ghana Engineering Students Association at KNUST.",
    url: EXECUTIVES_URL,
    numberOfItems: serving.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: serving.map((executive, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: executive.fullName,
        jobTitle: executive.executivePositionHeld,
        description: tenureSentence(executive, current),
        ...(profileUrl(executive) ? { url: profileUrl(executive) } : {}),
        ...(portrait(executive) ? { image: portrait(executive) } : {}),
        memberOf: { "@id": ORGANIZATION_ID },
      },
    })),
  };
}


export function executivePersonSchema(executive: Executive, current: string | null) {
  const serving = isCurrentYear(executive.academicYear, current);
  const range = academicYearRange(executive.academicYear);
  const url = profileUrl(executive);
  const organization = { "@id": ORGANIZATION_ID, "@type": "Organization", name: ORGANIZATION_NAME };

  const role = {
    "@type": "OrganizationRole",
    roleName: executive.executivePositionHeld,
    ...(range ?? {}),
    memberOf: organization,
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    ...(url ? { "@id": `${url}#profile`, url } : {}),
    dateModified: executive.sys.publishedAt ?? undefined,
    mainEntity: {
      "@type": "Person",
      ...(url ? { "@id": `${url}#person` } : {}),
      name: executive.fullName,
      description: tenureSentence(executive, current),
      ...(serving ? { jobTitle: executive.executivePositionHeld } : {}),
      ...(portrait(executive) ? { image: portrait(executive) } : {}),
      ...(executive.email ? { email: executive.email } : {}),
      ...(sameAs(executive).length > 0 ? { sameAs: sameAs(executive) } : {}),
      ...(serving ? { memberOf: role } : { alumniOf: organization, hasOccupation: role }),
      ...(executive.programmeOfStudy ? { knowsAbout: executive.programmeOfStudy } : {}),
    },
  };
}
