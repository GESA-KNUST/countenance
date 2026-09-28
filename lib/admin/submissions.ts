import {
  type CmaEntryItem,
  CmaError,
  LOCALE,
  assetLink,
  cma,
  cmaAll,
  entryLink,
  linkIds,
  managementToken,
  UPLOAD_BASE,
} from "./cma";
import { assetUrls } from "./assets";
import { randomUUID } from "node:crypto";
import { markdownToDocument } from "./richtext";
import { authorForEmail } from "./author-identity";

export const SUBMISSION_LIMITS = {
  title: 160,
  hook: 300,
  body: 40000,
  name: 120,
  email: 160,
  tags: 8,
  tagLength: 40,
  images: 8,
  imageBytes: 3 * 1024 * 1024,
};

export interface SubmissionInput {
  title: string;
  hook: string;
  body: string;
  coverImage: string;
  tags: string[];
}

export interface VerifiedWriter {
  email: string;
  name: string;
}

export interface SubmissionSummary {
  id: string;
  title: string;
  hook: string;
  contributorName: string;
  contributorEmail: string;
  submittedAt: string;
  coverUrl: string | null;
  hasAuthor: boolean;
  status: string;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function readSubmission(body: Record<string, unknown>): SubmissionInput | null {
  const title = clean(body.title, SUBMISSION_LIMITS.title);
  const hook = clean(body.hook, SUBMISSION_LIMITS.hook);
  const article = clean(body.body, SUBMISSION_LIMITS.body);
  const coverImage = clean(body.coverImage, 64);

  if (!title || !hook || !article || !coverImage) return null;
  if (!/^sub-[A-Za-z0-9._-]{1,58}$/.test(coverImage)) return null;

  const tags = Array.isArray(body.tags)
    ? [...new Set(
        body.tags
          .map((tag) => clean(tag, SUBMISSION_LIMITS.tagLength))
          .filter((tag) => tag.length > 0)
      )].slice(0, SUBMISSION_LIMITS.tags)
    : [];

  return { title, hook, body: article, coverImage, tags };
}

async function submissionAssetExists(id: string) {
  const asset = await cma(`/assets/${id}`);
  return Boolean(asset?.fields?.file?.[LOCALE]?.url);
}

async function publishedAuthorExists(id: string) {
  const entry = await cma(`/entries/${id}`);
  return Boolean(
    entry &&
      entry.sys.contentType?.sys?.id === "blogAuthor" &&
      entry.sys.publishedVersion
  );
}

export async function createSubmission(input: SubmissionInput, writer: VerifiedWriter) {
  if (!(await submissionAssetExists(input.coverImage))) {
    throw new Error("cover image does not exist");
  }

  const authorId = await authorForEmail(writer.email, writer.name);

  const fields: Record<string, Record<string, unknown>> = {
    title: { [LOCALE]: input.title },
    hook: { [LOCALE]: input.hook },
    blogContent: { [LOCALE]: markdownToDocument(input.body) },
    datePublished: { [LOCALE]: new Date().toISOString().slice(0, 10) },
    submissionStatus: { [LOCALE]: "submitted" },
    contributorName: { [LOCALE]: writer.name || writer.email },
    contributorEmail: { [LOCALE]: writer.email },
    headerImage: { [LOCALE]: assetLink(input.coverImage) },
    author: { [LOCALE]: entryLink(authorId) },
  };

  const created = await cma("/entries", {
    method: "POST",
    contentType: "blogPost",
    body: { fields },
  });

  return { id: created.sys.id };
}

export async function listSubmissions(): Promise<SubmissionSummary[]> {
  const items = await cmaAll(
    "/entries?content_type=blogPost&fields.submissionStatus=submitted&order=-sys.createdAt"
  );
  return summarise(items);
}

export async function submissionsFrom(all: CmaEntryItem[]): Promise<SubmissionSummary[]> {
  const items = all.filter(
    (item) =>
      item.sys.contentType?.sys?.id === "blogPost" &&
      item.fields?.submissionStatus?.[LOCALE] === "submitted"
  );
  return summarise(items);
}

async function summarise(items: CmaEntryItem[]): Promise<SubmissionSummary[]> {
  const coverIds = items
    .map((item) => (item.fields?.headerImage?.[LOCALE] as { sys?: { id?: string } })?.sys?.id)
    .filter((id): id is string => Boolean(id));
  const urls = await assetUrls([...new Set(coverIds)]);

  return items.map((item) => {
    const fields = item.fields ?? {};
    const coverId = (fields.headerImage?.[LOCALE] as { sys?: { id?: string } })?.sys?.id;
    return {
      id: item.sys.id,
      title: (fields.title?.[LOCALE] as string) ?? "Untitled",
      hook: (fields.hook?.[LOCALE] as string) ?? "",
      contributorName: (fields.contributorName?.[LOCALE] as string) ?? "Unknown",
      contributorEmail: (fields.contributorEmail?.[LOCALE] as string) ?? "",
      submittedAt: item.sys.updatedAt,
      coverUrl: coverId ? urls.get(coverId) ?? null : null,
      hasAuthor: Boolean((fields.author?.[LOCALE] as { sys?: { id?: string } })?.sys?.id),
      status: (fields.submissionStatus?.[LOCALE] as string) ?? "submitted",
    };
  });
}

async function publishLinkedAssets(entry: { fields?: Record<string, Record<string, unknown>> }) {
  const fields = entry.fields ?? {};
  const ids = new Set<string>();

  const header = (fields.headerImage?.[LOCALE] as { sys?: { id?: string } })?.sys?.id;
  if (header) ids.add(header);

  const document = fields.blogContent?.[LOCALE] as { content?: unknown[] } | undefined;
  const walk = (node: { nodeType?: string; data?: { target?: { sys?: { id?: string } } }; content?: unknown[] }) => {
    if (node.nodeType === "embedded-asset-block") {
      const id = node.data?.target?.sys?.id;
      if (id) ids.add(id);
    }
    for (const child of (node.content ?? []) as typeof node[]) walk(child);
  };
  if (document) walk(document as Parameters<typeof walk>[0]);

  for (const id of ids) {
    const asset = await cma(`/assets/${id}`);
    if (!asset || asset.sys.publishedVersion) continue;
    await cma(`/assets/${id}/published`, { method: "PUT", version: asset.sys.version });
  }
}

export async function approveSubmission(id: string) {
  const entry = await cma(`/entries/${id}`);
  if (!entry) throw new Error("That submission no longer exists");

  if (!entry.fields?.author?.[LOCALE]?.sys?.id) {
    throw new Error("Choose an author first, then approve.");
  }

  await publishLinkedAssets(entry);

  const fresh = await cma(`/entries/${id}`);
  const saved = await cma(`/entries/${id}`, {
    method: "PUT",
    version: fresh.sys.version,
    body: {
      fields: { ...fresh.fields, submissionStatus: { [LOCALE]: "approved" } },
    },
  });

  try {
    await cma(`/entries/${id}/published`, { method: "PUT", version: saved.sys.version });
  } catch (error) {
    if (error instanceof CmaError) {
      const messages = error.validationMessages();
      if (messages.length > 0) throw new Error(`Please fix this first: ${messages.join(" ")}`);
    }
    throw error;
  }
}

export async function rejectSubmission(id: string) {
  const entry = await cma(`/entries/${id}`);
  if (!entry) throw new Error("That submission no longer exists");

  if (entry.sys.publishedVersion) {
    await cma(`/entries/${id}/published`, { method: "DELETE", version: entry.sys.version });
  }

  const fresh = await cma(`/entries/${id}`);
  await cma(`/entries/${id}`, {
    method: "PUT",
    version: fresh.sys.version,
    body: { fields: { ...fresh.fields, submissionStatus: { [LOCALE]: "rejected" } } },
  });
}

export async function uploadSubmissionImage(
  bytes: ArrayBuffer,
  fileName: string,
  contentType: string
) {
  const stem = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 30);
  const id = `sub-${stem || "image"}-${randomUUID().slice(0, 8)}`;

  const upload = await fetch(`${UPLOAD_BASE}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${managementToken()}`,
      "Content-Type": "application/octet-stream",
    },
    body: bytes,
  });
  if (!upload.ok) throw new Error(`upload failed: ${upload.status}`);
  const { sys: uploadSys } = await upload.json();

  const draft = await cma(`/assets/${id}`, {
    method: "PUT",
    body: {
      fields: {
        title: { [LOCALE]: fileName.replace(/\.[^.]+$/, "") },
        description: { [LOCALE]: "" },
        file: {
          [LOCALE]: {
            fileName,
            contentType,
            uploadFrom: { sys: { type: "Link", linkType: "Upload", id: uploadSys.id } },
          },
        },
      },
    },
  });

  await cma(`/assets/${id}/files/${LOCALE}/process`, {
    method: "PUT",
    version: draft.sys.version,
  });

  let processed = null;
  let waited = 0;
  for (let attempt = 0; attempt < 14 && waited < 15000; attempt += 1) {
    const pause = attempt < 4 ? 400 : 1500;
    await new Promise((resolve) => setTimeout(resolve, pause));
    waited += pause;
    processed = await cma(`/assets/${id}`);
    if (processed?.fields?.file?.[LOCALE]?.url) break;
    processed = null;
  }
  if (!processed) throw new Error("That photo did not finish processing");

  return { id, url: `https:${processed.fields.file[LOCALE].url}`, fileName };
}

export { linkIds };
