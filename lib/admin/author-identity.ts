import { type CmaEntryItem, LOCALE, cma, cmaAll, entryLink } from "./cma";
import { uploadSubmissionImage } from "./submissions";
import { LogError } from "../logger";

/**
 * A blog author belongs to exactly one verified email address, and the binding
 * lives in `authorIdentity` entries that are deliberately never published — the
 * Content Delivery API cannot read drafts, so writers' addresses stay private
 * even though the delivery token is public.
 *
 * This is what stops one person writing as another: nobody chooses who they
 * are, the address they proved at sign-in decides it.
 */

interface Identity {
  email: string;
  authorId: string;
}

function identityOf(entry: CmaEntryItem): Identity | null {
  const fields = entry.fields as Record<string, Record<string, unknown>> | undefined;
  const email = fields?.email?.[LOCALE];
  const author = fields?.author?.[LOCALE] as { sys?: { id?: string } } | undefined;
  if (typeof email !== "string" || !author?.sys?.id) return null;
  return { email: email.toLowerCase(), authorId: author.sys.id };
}

async function findIdentity(email: string): Promise<Identity | null> {
  const wanted = email.toLowerCase();
  const items = await cmaAll(
    `/entries?content_type=authorIdentity&fields.email=${encodeURIComponent(wanted)}`
  );

  for (const item of items) {
    const identity = identityOf(item);
    if (identity && identity.authorId && identity.email === wanted) return identity;
  }
  return null;
}

/** Best effort: a missing photo is not a reason to refuse somebody's article. */
async function pictureAsset(pictureUrl: string, name: string): Promise<string | null> {
  if (!pictureUrl) return null;

  try {
    const response = await fetch(pictureUrl, { cache: "no-store" });
    if (!response.ok) return null;

    const type = response.headers.get("content-type") ?? "image/jpeg";
    if (!type.startsWith("image/")) return null;

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > 3 * 1024 * 1024) return null;

    const extension = type.includes("png") ? "png" : "jpg";
    const asset = await uploadSubmissionImage(bytes, `${name || "writer"}.${extension}`, type);
    return asset.id;
  } catch (error) {
    LogError("[authorIdentity] profile picture", error);
    return null;
  }
}

async function createAuthor(name: string, pictureUrl: string) {
  const fields: Record<string, Record<string, unknown>> = {
    name: { [LOCALE]: name },
  };

  const assetId = await pictureAsset(pictureUrl, name);
  if (assetId) {
    fields.authorProfilePicture = {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assetId } },
    };
  }

  const created = await cma("/entries", {
    method: "POST",
    contentType: "blogAuthor",
    body: { fields },
  });

  return created.sys.id as string;
}

/**
 * Returns the author record for a verified address, creating one the first time
 * somebody writes. The identity entry is left as a draft on purpose.
 */
export async function authorForEmail(
  email: string,
  name: string,
  pictureUrl: string
): Promise<string> {
  const existing = await findIdentity(email);
  if (existing) return existing.authorId;

  const authorId = await createAuthor(name || email.split("@")[0], pictureUrl);

  await cma("/entries", {
    method: "POST",
    contentType: "authorIdentity",
    body: {
      fields: {
        email: { [LOCALE]: email.toLowerCase() },
        author: { [LOCALE]: entryLink(authorId) },
      },
    },
  });

  return authorId;
}
