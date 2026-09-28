import { cache } from "react";
import { CLUB_TYPES, OPPORTUNITY_TYPES } from "../data/taxonomy";
import { generatedCollections } from "./content-model";

export type FieldKind =
  | "text"
  | "longtext"
  | "richtext"
  | "url"
  | "email"
  | "phone"
  | "date"
  | "datetime"
  | "number"
  | "image"
  | "images"
  | "entryRef"
  | "entryRefs"
  | "stringList"
  | "boolean"
  | "location"
  | "inlineRef"
  | "tagWords"
  | "select";

export interface FieldSpec {
  id: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  hint?: string;
  refType?: string;
  refField?: string;
  options?: { value: string; label: string }[];
  allowImages?: boolean;
  inlineCreate?: { nameField: string; imageField?: string; imageLabel?: string };
}

export type CollectionGroupName = "Gallery" | "Blog";

export interface CollectionSpec {
  group?: CollectionGroupName;
  type: string;
  label: string;
  singular: string;
  hint: string;
  titleField: string;

  slugFrom?: string[];

  slugUrl?: string;

  slugFollowsTitle?: boolean;
  thumbField?: string;
  singleton?: boolean;

  orderable?: boolean;

  generated?: boolean;
  fields: FieldSpec[];
}

export const COLLECTIONS: CollectionSpec[] = [
  {
    type: "blogPost",
    group: "Blog",
    slugUrl: "gesaknust.com/blog/",
    label: "Blog posts",
    singular: "blog post",
    hint: "Articles on the blog",
    titleField: "title",
    thumbField: "headerImage",
    fields: [
      { id: "title", label: "Title", kind: "text", required: true },
      { id: "hook", label: "Short summary", kind: "text", required: true, hint: "One line shown under the title in listings." },
      { id: "headerImage", label: "Cover photo", kind: "image", required: true },
      {
        id: "author",
        label: "Author",
        kind: "inlineRef",
        required: true,
        refType: "blogAuthor",
        inlineCreate: { nameField: "name", imageField: "authorProfilePicture", imageLabel: "Their photo" },
      },
      { id: "datePublished", label: "Date published", kind: "date", required: true },
      { id: "blogContent", label: "Article", kind: "richtext", required: true },
      {
        id: "tags",
        label: "Tags",
        kind: "tagWords",
        refType: "blogTaglist",
        refField: "tags",
        hint: "Topics this article covers, like \"study tips\" or \"internships\". Type one and press Enter.",
      },
      { id: "slug", label: "Web address", kind: "text", hint: "Leave this empty and it is made from the title automatically." },
    ],
  },
  {
    type: "eventCard",
    slugUrl: "gesaknust.com/events#event-",
    label: "Events",
    singular: "event",
    hint: "Upcoming and past events",
    titleField: "title",
    thumbField: "eventImage",
    fields: [
      { id: "title", label: "Event name", kind: "text" },
      { id: "description", label: "Description", kind: "longtext", required: true },
      { id: "eventImage", label: "Photo", kind: "image", required: true },
      { id: "eventDate", label: "Date and time", kind: "datetime", required: true },
      { id: "venueInPlainEnglish", label: "Where (in words)", kind: "text", required: true, hint: "For example: Engineering Auditorium, KNUST." },
      {
        id: "venue",
        label: "Where it is on the map",
        kind: "location",
        required: true,
        hint: "Search for the place or tap the map to drop the pin.",
      },
      { id: "onlineLink", label: "Online link", kind: "url", hint: "Only if people can join online." },
      { id: "slug", label: "Web address", kind: "text", hint: "Leave this empty and it is made from the name automatically." },
    ],
  },
  {
    type: "personalityOfTheWeek",
    label: "Personality of the week",
    singular: "personality",
    hint: "The one person featured on the front page",
    titleField: "name",
    slugUrl: "gesaknust.com/personality/",
    slugFollowsTitle: true,
    thumbField: "image",
    singleton: true,
    fields: [
      { id: "name", label: "Their name", kind: "text", required: true },
      { id: "role", label: "What they do", kind: "text", hint: "For example: Telecommunications Engineering student." },
      { id: "image", label: "Photo", kind: "image", required: true },
      {
        id: "description",
        label: "About them",
        kind: "richtext",
        required: true,
        allowImages: false,
      },
      { id: "linkedinUrl", label: "LinkedIn page", kind: "url" },
      { id: "slug", label: "Web address", kind: "text", hint: "Leave this empty and it is made from their name automatically." },
    ],
  },
  {
    type: "galleryGroup",
    group: "Gallery",
    label: "Albums",
    singular: "album",
    hint: "Photo albums on the gallery page",
    titleField: "eventName",
    thumbField: "sampleImages",
    fields: [
      { id: "eventName", label: "Album name", kind: "text", required: true },
      { id: "sampleImages", label: "Preview photos", kind: "images", required: true, hint: "A few photos shown on the gallery page." },
      { id: "picturesLink", label: "Link to all photos", kind: "url", required: true, hint: "Google Drive or similar, for the full album." },
    ],
  },
  {
    type: "hub",
    label: "Opportunities",
    singular: "opportunity",
    hint: "Scholarships, internships and other openings",
    titleField: "title",
    fields: [
      { id: "title", label: "Title", kind: "text", required: true },
      { id: "description", label: "Description", kind: "text", required: true },
      { id: "applicationDeadline", label: "Application deadline", kind: "date", required: true },
      { id: "source", label: "Link to apply", kind: "url", required: true },
      {
        id: "opportunityType",
        label: "Type",
        kind: "select",
        options: OPPORTUNITY_TYPES,
        hint: "This decides which tab it shows under on the website.",
      },
    ],
  },
  {
    type: "announcements",
    label: "Announcements",
    singular: "announcement",
    hint: "Notices shown across the site",
    titleField: "title",
    fields: [
      { id: "title", label: "Title", kind: "text", required: true },
      { id: "description", label: "Message", kind: "text", required: true },
      { id: "dueDate", label: "Show until", kind: "date", required: true },
      { id: "actionLink", label: "Link", kind: "url" },
    ],
  },
  {
    type: "executive",
    label: "Executives",
    singular: "executive",
    hint: "Student leaders, by academic year",
    titleField: "fullName",
    slugFrom: ["fullName", "academicYear"],
    slugUrl: "gesaknust.com/executives/",
    thumbField: "officialImage",
    fields: [
      { id: "fullName", label: "Full name", kind: "text", required: true },
      { id: "executivePositionHeld", label: "Position", kind: "text", required: true },
      { id: "academicYear", label: "Academic year", kind: "text", required: true, hint: "Use the same wording every time, for example 2025-2026, so the year filter groups them together." },
      { id: "officialImage", label: "Photo", kind: "image", required: true },
      { id: "primarySocialLink", label: "Main link", kind: "url", required: true, hint: "Where the card links to if there is no profile page." },
      { id: "programmeOfStudy", label: "Programme of study", kind: "text", hint: "For example: Chemical Engineering, Level 400." },
      { id: "quote", label: "Personal quote", kind: "longtext", hint: "One or two lines shown large on their profile page." },
      { id: "bio", label: "Biography", kind: "richtext", hint: "Filling this in gives this person their own profile page." },
      { id: "achievements", label: "Achievements", kind: "stringList", hint: "One per line." },
      { id: "portfolioImages", label: "Portfolio photos", kind: "images", hint: "Work, projects or events to show on their profile page." },
      { id: "portfolioLink", label: "Portfolio or website", kind: "url" },
      { id: "linkedInUrl", label: "LinkedIn", kind: "url" },
      { id: "instagramUrl", label: "Instagram", kind: "url" },
      { id: "xUrl", label: "X (Twitter)", kind: "url" },
      { id: "email", label: "Email", kind: "email" },
      { id: "slug", label: "Web address", kind: "text", hint: "Leave this empty and it is made from their name automatically." },
    ],
  },
  {
    type: "club",
    label: "Clubs",
    singular: "club",
    hint: "Clubs and societies",
    titleField: "clubName",
    thumbField: "clubLogo",
    fields: [
      { id: "clubName", label: "Club name", kind: "text", required: true },
      { id: "clubLogo", label: "Logo", kind: "image", required: true },
      { id: "description", label: "Short description", kind: "text", required: true },
      {
        id: "clubType",
        label: "Type",
        kind: "select",
        required: true,
        options: CLUB_TYPES,
        hint: "This decides which tab it shows under on the website.",
      },
      { id: "clubLink", label: "Link", kind: "url", required: true },
      { id: "isFeatured", label: "Show as featured", kind: "boolean", required: true },
      { id: "isActivelyRecruitingMembers", label: "Currently recruiting", kind: "boolean", required: true },
      { id: "aboutclub", label: "About the club", kind: "richtext" },
    ],
  },
  {
    type: "department",
    label: "Departments",
    singular: "department",
    hint: "Engineering departments",
    titleField: "name",
    thumbField: "deptLogo",
    fields: [
      { id: "name", label: "Department name", kind: "text", required: true },
      { id: "deptAbbreviation", label: "Short name", kind: "text", required: true, hint: "For example: ChemEng." },
      { id: "deptLogo", label: "Logo", kind: "image", required: true },
      { id: "about", label: "About", kind: "richtext", required: true },
      { id: "vision", label: "Vision", kind: "richtext", required: true },
      { id: "mission", label: "Mission", kind: "richtext", required: true },
      { id: "deptPhone", label: "Phone", kind: "phone", required: true },
      { id: "deptEmail", label: "Email", kind: "email" },
      { id: "websiteLink", label: "Website", kind: "url" },
      { id: "deptLinkedIn", label: "LinkedIn", kind: "url" },
      { id: "whatsappLink", label: "WhatsApp", kind: "url" },
      { id: "xComLink", label: "X (Twitter)", kind: "url" },
      { id: "tiktokLink", label: "TikTok", kind: "url" },
    ],
  },
  {
    type: "faculty",
    label: "Faculties",
    singular: "faculty",
    hint: "Faculties and the departments under them",
    titleField: "name",
    thumbField: "facultyMainImage",
    fields: [
      { id: "name", label: "Faculty name", kind: "text", required: true },
      { id: "about", label: "About", kind: "longtext", required: true },
      { id: "vision", label: "Vision", kind: "longtext", required: true },
      { id: "mission", label: "Mission", kind: "longtext", required: true },
      { id: "facultyMainImage", label: "Photos", kind: "images" },
      { id: "departmentsUnderFaculty", label: "Departments", kind: "entryRefs", required: true, refType: "department" },
      { id: "facultyWebsite", label: "Website", kind: "url" },
      { id: "facultyMail", label: "Email", kind: "email" },
      { id: "facultyLinkedIn", label: "LinkedIn", kind: "url" },
      { id: "facultyTwitter", label: "X (Twitter)", kind: "url" },
    ],
  },
  {
    type: "blogAuthor",
    group: "Blog",
    label: "Blog authors",
    singular: "author",
    hint: "People who write blog posts",
    titleField: "name",
    thumbField: "authorProfilePicture",
    fields: [
      { id: "name", label: "Name", kind: "text", required: true },
      { id: "authorProfilePicture", label: "Photo", kind: "image", required: true },
    ],
  },
  {
    type: "blogTaglist",
    group: "Blog",
    label: "Blog tags",
    singular: "tag list",
    hint: "Groups of tags a post can use",
    titleField: "title",
    fields: [
      { id: "title", label: "Name", kind: "text" },
      { id: "tags", label: "Tags", kind: "stringList", required: true, hint: "One tag per line." },
    ],
  },
  {
    type: "generalSiteContent",
    label: "Contact details",
    singular: "contact details",
    hint: "Phone, email and social links shown in the footer and contact page",
    titleField: "gesaEmail",
    singleton: true,
    fields: [
      { id: "phone", label: "Phone", kind: "phone", required: true },
      { id: "gesaEmail", label: "Email", kind: "email", required: true },
      { id: "gesaWhatsappLink", label: "WhatsApp channel", kind: "url" },
      { id: "gesaFacebookLink", label: "Facebook", kind: "url" },
      { id: "gesaInstagramLink", label: "Instagram", kind: "url" },
      { id: "gesaTwitter", label: "X (Twitter)", kind: "url" },
      { id: "gesaLinkedInLink", label: "LinkedIn", kind: "url" },
    ],
  },
];

export interface CollectionGroup {
  name: CollectionGroupName;
  hint: string;
  collections: CollectionSpec[];
}

const GROUP_HINTS: Record<CollectionGroupName, string> = {
  Gallery: "Photo albums on the gallery page",
  Blog: "Articles, the people who write them, and tags",
};

const HAND_AUTHORED_TYPES = new Set(COLLECTIONS.map((collection) => collection.type));

export const loadCollections = cache(async (): Promise<CollectionSpec[]> => {
  const generated = await generatedCollections(HAND_AUTHORED_TYPES);
  return [...COLLECTIONS, ...generated];
});

export async function findCollection(type: string): Promise<CollectionSpec | undefined> {
  return (await loadCollections()).find((collection) => collection.type === type);
}

export async function collectionGroups(): Promise<CollectionGroup[]> {
  const collections = await loadCollections();
  const names: CollectionGroupName[] = [];
  for (const collection of collections) {
    if (collection.group && !names.includes(collection.group)) names.push(collection.group);
  }
  return names.map((name) => ({
    name,
    hint: GROUP_HINTS[name],
    collections: collections.filter((collection) => collection.group === name),
  }));
}

export async function findGroup(name: string): Promise<CollectionGroup | undefined> {
  return (await collectionGroups()).find(
    (group) => group.name.toLowerCase() === name.toLowerCase()
  );
}

export async function ungroupedCollections(): Promise<CollectionSpec[]> {
  return (await loadCollections()).filter((collection) => !collection.group);
}
