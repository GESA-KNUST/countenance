export interface TaxonomyOption {
  value: string;
  label: string;
}

export const OPPORTUNITY_TYPES: TaxonomyOption[] = [
  { value: "Internship", label: "Internships" },
  { value: "Scholarship", label: "Scholarships" },
  { value: "Financial Aid", label: "Financial Aid" },
];

export const CLUB_TYPES: TaxonomyOption[] = [
  { value: "Tech Clubs", label: "Tech Clubs" },
  { value: "Creative & Arts", label: "Creative & Arts" },
  { value: "Leadership & Service", label: "Leadership & Service" },
  { value: "Sports & Fitness", label: "Sports & Fitness" },
  { value: "Academic Societies", label: "Academic Societies" },
];

export function matchesOpportunityType(stored: string | null | undefined, value: string) {
  return (stored ?? "").trim().toLowerCase() === value.toLowerCase();
}

export function matchesClubType(stored: string | null | undefined, value: string) {
  return (stored ?? "").trim().toLowerCase() === value.toLowerCase();
}
