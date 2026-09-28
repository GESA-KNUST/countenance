import { type CmaEntryItem, LOCALE, cma, cmaAll, entryLink } from "./cma";
import { assetUrls } from "./assets";

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

async function createAuthor(name: string) {
  const fields: Record<string, Record<string, unknown>> = {
    name: { [LOCALE]: name },
  };

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
export async function authorForEmail(email: string, name: string): Promise<string> {
  const existing = await findIdentity(email);
  if (existing) return existing.authorId;

  const authorId = await createAuthor(name || email.split("@")[0]);

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

export interface WriterProfile {
  authorId: string;
  name: string;
  photoUrl: string | null;
}

/**
 * The writer's own saved photo, never one borrowed from Google. Returns null
 * until they have written or set a picture, so the form can offer to take one.
 */
export async function profileForEmail(email: string): Promise<WriterProfile | null> {
  const identity = await findIdentity(email);
  if (!identity) return null;

  const author = await cma(`/entries/${identity.authorId}`);
  if (!author) return null;

  const fields = author.fields as Record<string, Record<string, unknown>> | undefined;
  const name = typeof fields?.name?.[LOCALE] === "string" ? (fields.name[LOCALE] as string) : "";
  const photo = fields?.authorProfilePicture?.[LOCALE] as { sys?: { id?: string } } | undefined;
  const photoId = photo?.sys?.id;

  let photoUrl: string | null = null;
  if (photoId) {
    const urls = await assetUrls([photoId]);
    photoUrl = urls.get(photoId) ?? null;
  }

  return { authorId: identity.authorId, name, photoUrl };
}

/**
 * Saves a picture the writer chose themselves, creating their author record if
 * this is the first thing they have done.
 */
export async function setWriterPhoto(
  email: string,
  name: string,
  assetId: string
): Promise<string | null> {
  const authorId = await authorForEmail(email, name);
  const author = await cma(`/entries/${authorId}`);

  const fields = {
    ...((author?.fields ?? {}) as Record<string, Record<string, unknown>>),
    authorProfilePicture: {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assetId } },
    },
  };

  await cma(`/entries/${authorId}`, {
    method: "PUT",
    version: author.sys.version,
    body: { fields },
  });

  const urls = await assetUrls([assetId]);
  return urls.get(assetId) ?? null;
}
