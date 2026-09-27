import type { PageHeroKey } from "../data/page-hero";

export const ADMIN_PAGES: { key: PageHeroKey; label: string; hint: string; path: string }[] = [
  { key: "home", label: "Home", hint: "The big photos on the front page", path: "/" },
  { key: "gallery", label: "Gallery", hint: "Top of the gallery page", path: "/gallery" },
  { key: "department", label: "Departments", hint: "Top of the departments page", path: "/department" },
  { key: "team", label: "Team", hint: "Top of the team page", path: "/team" },
  { key: "executives", label: "Executives", hint: "Top of the executives page", path: "/executives" },
  { key: "contact-us", label: "Contact us", hint: "Top of the contact page", path: "/contact-us" },
];

export function findAdminPage(key: string) {
  return ADMIN_PAGES.find((page) => page.key === key);
}
