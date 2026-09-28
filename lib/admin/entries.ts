import { type CmaEntryItem, CmaError, LOCALE, assetLink, cma, cmaAll, entryLink, linkIds } from "./cma";
import { assetUrls } from "./assets";
import { buildSlug, cleanSlug } from "./slug";
import {
  COLLECTIONS,
  type CollectionSpec,
  type FieldSpec,
  findCollection,
  loadCollections,
} from "./collections";
import {
  assetIdsInDocument,
  canEditAsMarkdown,
  documentToMarkdown,
  markdownToDocument,
} from "./richtext";

export interface NewInlineEntry {
  __new: true;
  name: string;
  image: string;
}

export type FieldValue =
  | string
  | string[]
  | boolean
  | { lat: number; lon: number }
  | NewInlineEntry
  | null;

function isNewInline(value: FieldValue): value is NewInlineEntry {
  return typeof value === "object" && value !== null && "__new" in value;
}

export interface EntrySummary {
  id: string;
  title: string;
  updatedAt: string;
  published: boolean;
  thumbUrl: string | null;
}

export interface EntryDetail {
  id: string | null;
  values: Record<string, FieldValue>;
  assetUrls: Record<string, string>;
  lockedFields: Record<string, string>;
  published: boolean;
}

export interface RefOption {
  id: string;
  label: string;
}

type RawFields = Record<string, Record<string, unknown> | undefined>;

function raw(fields: RawFields, id: string) {
  return fields?.[id]?.[LOCALE];
}

function assetIdsIn(collection: CollectionSpec, fields: RawFields) {
  const ids: string[] = [];
  for (const field of collection.fields) {
    const value = raw(fields, field.id);
    if (field.kind === "image") {
      const id = (value as { sys?: { id?: string } })?.sys?.id;
      if (id) ids.push(id);
    }
    if (field.kind === "images") {
      ids.push(...linkIds(value as { sys?: { id?: string } }[] | undefined));
    }
    if (field.kind === "richtext") {
      ids.push(...assetIdsInDocument(value));
    }
  }
  return ids;
}

function titleOf(collection: CollectionSpec, fields: RawFields, id: string) {
  const value = collection.titleField ? raw(fields, collection.titleField) : null;
  if (typeof value === "string" && value.trim() !== "") return value;
  return `Untitled (${id.slice(0, 6)})`;
}

export async function listEntries(type: string): Promise<EntrySummary[]> {
  const collection = await findCollection(type);
  if (!collection) return [];

  const order = collection.orderable === false ? "-sys.updatedAt" : "fields.order,-sys.updatedAt";
  const items = await cmaAll(`/entries?content_type=${type}&order=${order}`);

  const thumbIds: string[] = [];
  for (const item of items) {
    if (!collection.thumbField) continue;
    const value = raw(item.fields ?? {}, collection.thumbField);
    const single = (value as { sys?: { id?: string } })?.sys?.id;
    if (single) thumbIds.push(single);
    else {
      const [first] = linkIds(value as { sys?: { id?: string } }[] | undefined);
      if (first) thumbIds.push(first);
    }
  }
  const urls = await assetUrls([...new Set(thumbIds)]);

  return items.map((item: { sys: { id: string; updatedAt: string; publishedVersion?: number }; fields?: RawFields }) => {
    const fields = item.fields ?? {};
    let thumbUrl: string | null = null;
    if (collection.thumbField) {
      const value = raw(fields, collection.thumbField);
      const single = (value as { sys?: { id?: string } })?.sys?.id;
      const id = single ?? linkIds(value as { sys?: { id?: string } }[] | undefined)[0];
      thumbUrl = id ? urls.get(id) ?? null : null;
    }

    return {
      id: item.sys.id,
      title: titleOf(collection, fields, item.sys.id),
      updatedAt: item.sys.updatedAt,
      published: Boolean(item.sys.publishedVersion),
      thumbUrl,
    };
  });
}

export function blankEntry(collection: CollectionSpec): EntryDetail {
  const values: Record<string, FieldValue> = {};
  for (const field of collection.fields) {
    if (
      field.kind === "images" ||
      field.kind === "entryRefs" ||
      field.kind === "stringList" ||
      field.kind === "tagWords"
    ) {
      values[field.id] = [];
    } else if (field.kind === "boolean") {
      values[field.id] = false;
    } else if (field.kind === "location") {
      values[field.id] = null;
    } else {
      values[field.id] = "";
    }
  }
  return { id: null, values, assetUrls: {}, lockedFields: {}, published: false };
}

export async function readEntry(type: string, id: string): Promise<EntryDetail | null> {
  const collection = await findCollection(type);
  if (!collection) return null;

  const entry = await cma(`/entries/${id}`);
  if (!entry) return null;

  const fields: RawFields = entry.fields ?? {};
  const values: Record<string, FieldValue> = {};
  const lockedFields: Record<string, string> = {};

  for (const field of collection.fields) {
    const value = raw(fields, field.id);

    switch (field.kind) {
      case "richtext": {
        const check = canEditAsMarkdown(value);
        if (!check.ok) {
          lockedFields[field.id] = check.reason;
          values[field.id] = "";
        } else {
          values[field.id] = documentToMarkdown(value);
        }
        break;
      }
      case "image":
        values[field.id] = (value as { sys?: { id?: string } })?.sys?.id ?? "";
        break;
      case "images":
        values[field.id] = linkIds(value as { sys?: { id?: string } }[] | undefined);
        break;
      case "entryRef":
      case "inlineRef":
        values[field.id] = (value as { sys?: { id?: string } })?.sys?.id ?? "";
        break;
      case "tagWords":
        values[field.id] = [];
        break;
      case "entryRefs":
        values[field.id] = linkIds(value as { sys?: { id?: string } }[] | undefined);
        break;
      case "stringList":
        values[field.id] = Array.isArray(value) ? (value as string[]) : [];
        break;
      case "boolean":
        values[field.id] = Boolean(value);
        break;
      case "location":
        values[field.id] = (value as { lat: number; lon: number }) ?? null;
        break;
      case "date":
        values[field.id] = typeof value === "string" ? value.slice(0, 10) : "";
        break;
      case "datetime":
        values[field.id] = typeof value === "string" ? value.slice(0, 16) : "";
        break;
      case "number":
        values[field.id] = typeof value === "number" ? String(value) : "";
        break;
      default:
        values[field.id] = typeof value === "string" ? value : "";
    }
  }

  for (const field of collection.fields) {
    if (field.kind !== "tagWords") continue;
    const linkedId = (raw(fields, field.id) as { sys?: { id?: string } })?.sys?.id;
    values[field.id] = await readTagWords(field, linkedId);
  }

  const urls = await assetUrls([...new Set(assetIdsIn(collection, fields))]);

  return {
    id: entry.sys.id,
    values,
    assetUrls: Object.fromEntries(urls),
    lockedFields,
    published: Boolean(entry.sys.publishedVersion),
  };
}

async function uniqueSlug(type: string, base: string, selfId: string | null) {
  const existing = await cmaAll(`/entries?content_type=${type}`);
  const taken = new Set(
    existing
      .filter((item) => item.sys.id !== selfId)
      .map((item) => item.fields?.slug?.[LOCALE])
      .filter((value): value is string => typeof value === "string")
  );

  if (!taken.has(base)) return base;
  for (let suffix = 2; suffix < 60; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

function linkedAssetIds(fields: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(fields)) {
    for (const item of fields) linkedAssetIds(item, found);
    return found;
  }
  if (fields && typeof fields === "object") {
    const sys = (fields as { sys?: { linkType?: string; id?: string } }).sys;
    if (sys?.linkType === "Asset" && sys.id) found.add(sys.id);
    for (const value of Object.values(fields as Record<string, unknown>)) {
      linkedAssetIds(value, found);
    }
  }
  return found;
}

async function publishLinkedAssets(fields: unknown) {
  for (const id of linkedAssetIds(fields)) {
    try {
      const asset = await cma(`/assets/${id}`);
      if (!asset || asset.sys.publishedVersion) continue;
      if (!asset.fields?.file?.[LOCALE]?.url) continue;
      await cma(`/assets/${id}/published`, { method: "PUT", version: asset.sys.version });
    } catch {

    }
  }
}

async function nextOrder(type: string) {
  const items = await cmaAll(`/entries?content_type=${type}&order=-fields.order`);
  const highest = items
    .map((item) => item.fields?.order?.[LOCALE])
    .filter((value): value is number => typeof value === "number");
  return (highest.length > 0 ? Math.max(...highest) : 0) + 1;
}

export async function setEntryOrder(type: string, ids: string[]) {
  const items = await cmaAll(`/entries?content_type=${type}`);
  const current = new Map<string, { version: number; published: boolean; fields: Record<string, unknown>; order: unknown }>();

  for (const item of items) {
    current.set(item.sys.id, {
      version: item.sys.version,
      published: Boolean(item.sys.publishedVersion),
      fields: (item.fields ?? {}) as Record<string, unknown>,
      order: item.fields?.order?.[LOCALE],
    });
  }

  const failures: string[] = [];

  for (const [index, id] of ids.entries()) {
    const entry = current.get(id);
    const position = index + 1;
    if (!entry || entry.order === position) continue;

    try {
      const saved = await cma(`/entries/${id}`, {
        method: "PUT",
        version: entry.version,
        body: { fields: { ...entry.fields, order: { [LOCALE]: position } } },
      });
      if (entry.published) {
        await cma(`/entries/${id}/published`, { method: "PUT", version: saved.sys.version });
      }
    } catch (error) {
      const messages = error instanceof CmaError ? error.validationMessages() : [];
      failures.push(messages[0] ?? `One item could not be reordered`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Some items could not be reordered. ${failures[0]}`);
  }
}

async function createInlineEntry(field: FieldSpec, value: NewInlineEntry): Promise<string> {
  const spec = field.inlineCreate;
  if (!spec || !field.refType) throw new Error("This field cannot create new items");

  const fields: Record<string, Record<string, unknown>> = {
    [spec.nameField]: { [LOCALE]: value.name.trim() },
  };
  if (spec.imageField && value.image) {
    fields[spec.imageField] = { [LOCALE]: assetLink(value.image) };
  }

  const created = await cma("/entries", {
    method: "POST",
    contentType: field.refType,
    body: { fields },
  });

  const published = await cma(`/entries/${created.sys.id}/published`, {
    method: "PUT",
    version: created.sys.version,
  });
  if (!published?.sys?.publishedVersion) {
    throw new Error(`Saved, but the new ${field.label.toLowerCase()} could not be published`);
  }

  return created.sys.id;
}

async function resolveTagList(
  field: FieldSpec,
  words: string[],
  linkedId: string | undefined,
  postTitle: string
): Promise<string | undefined> {
  if (!field.refType || !field.refField) return undefined;
  const cleaned = [...new Set(words.map((word) => word.trim()).filter(Boolean))];
  if (cleaned.length === 0) return undefined;

  const reusable = linkedId ? await isTagListPrivate(field, linkedId) : false;

  if (linkedId && reusable) {
    const existing = await cma(`/entries/${linkedId}`);
    if (existing) {
      const saved = await cma(`/entries/${linkedId}`, {
        method: "PUT",
        version: existing.sys.version,
        body: {
          fields: {
            ...existing.fields,
            title: { [LOCALE]: postTitle },
            [field.refField]: { [LOCALE]: cleaned },
          },
        },
      });
      await cma(`/entries/${linkedId}/published`, {
        method: "PUT",
        version: saved.sys.version,
      });
      return linkedId;
    }
  }

  const created = await cma("/entries", {
    method: "POST",
    contentType: field.refType,
    body: {
      fields: {
        title: { [LOCALE]: postTitle },
        [field.refField]: { [LOCALE]: cleaned },
      },
    },
  });
  await cma(`/entries/${created.sys.id}/published`, {
    method: "PUT",
    version: created.sys.version,
  });
  return created.sys.id;
}

async function isTagListPrivate(field: FieldSpec, tagListId: string) {
  const users = await cmaAll(`/entries?links_to_entry=${tagListId}`);
  return users.length <= 1;
}

async function readTagWords(field: FieldSpec, linkedId: string | undefined) {
  if (!linkedId || !field.refField) return [] as string[];
  const entry = await cma(`/entries/${linkedId}`);
  const words = entry?.fields?.[field.refField]?.[LOCALE];
  return Array.isArray(words) ? (words as string[]) : [];
}

function missingRequired(collection: CollectionSpec, values: Record<string, FieldValue>) {
  return collection.fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = values[field.id];
      if (isNewInline(value)) return value.name.trim() === "" || value.image.trim() === "";
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "boolean") return false;
      if (field.kind === "location") return !value;
      return typeof value !== "string" || value.trim() === "";
    })
    .map((field) => field.label);
}

function toContentful(field: FieldSpec, value: FieldValue, existing: unknown) {
  switch (field.kind) {
    case "richtext": {
      const markdown = typeof value === "string" ? value : "";
      if (existing !== undefined && value === null) return existing;
      return markdown.trim() === "" ? undefined : markdownToDocument(markdown);
    }
    case "image":
      return typeof value === "string" && value ? assetLink(value) : undefined;
    case "images":
      return Array.isArray(value) && value.length > 0 ? value.map(assetLink) : undefined;
    case "entryRef":
    case "inlineRef":
      return typeof value === "string" && value ? entryLink(value) : undefined;
    case "tagWords":
      return undefined;
    case "entryRefs":
      return Array.isArray(value) && value.length > 0 ? value.map(entryLink) : undefined;
    case "stringList":
      return Array.isArray(value) && value.length > 0 ? value : undefined;
    case "boolean":
      return Boolean(value);
    case "location":
      return value && typeof value === "object" ? value : undefined;
    case "date":
    case "datetime":
      return typeof value === "string" && value ? value : undefined;
    case "number": {
      if (typeof value !== "string" || value.trim() === "") return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    default:
      return typeof value === "string" && value.trim() !== "" ? value : undefined;
  }
}

export interface SaveResult {
  id: string;
}

export async function saveEntry(
  type: string,
  id: string | null,
  values: Record<string, FieldValue>,
  lockedFields: string[] = []
): Promise<SaveResult> {
  const collection = await findCollection(type);
  if (!collection) throw new Error("Unknown collection");

  const missing = missingRequired(collection, values);
  if (missing.length > 0) {
    throw new Error(`Please fill in: ${missing.join(", ")}`);
  }

  const existing = id ? await cma(`/entries/${id}`) : null;
  if (id && !existing) throw new Error("That item no longer exists");

  const resolved: Record<string, FieldValue> = { ...values };

  for (const field of collection.fields) {
    if (field.kind === "inlineRef") {
      const value = resolved[field.id];
      if (isNewInline(value)) {
        resolved[field.id] = await createInlineEntry(field, value);
      }
      continue;
    }

    if (field.kind === "tagWords") {
      const words = Array.isArray(resolved[field.id]) ? (resolved[field.id] as string[]) : [];
      const linkedId = existing?.fields?.[field.id]?.[LOCALE]?.sys?.id as string | undefined;
      const titleValue = collection.titleField ? resolved[collection.titleField] : "";
      const title = typeof titleValue === "string" && titleValue ? titleValue : collection.singular;
      const tagListId = await resolveTagList(field, words, linkedId, title);
      resolved[field.id] = tagListId ?? "";
    }
  }

  const locked = new Set(lockedFields);
  const fields: Record<string, Record<string, unknown>> = {
    ...((existing?.fields ?? {}) as Record<string, Record<string, unknown>>),
  };

  for (const field of collection.fields) {
    const previous = existing?.fields?.[field.id]?.[LOCALE];

    if (field.kind === "richtext" && locked.has(field.id)) {
      if (previous !== undefined) fields[field.id] = { [LOCALE]: previous };
      else delete fields[field.id];
      continue;
    }

    const source = field.kind === "tagWords" ? "entryRef" : field.kind;
    const converted = toContentful({ ...field, kind: source }, resolved[field.id], previous);
    if (converted !== undefined) fields[field.id] = { [LOCALE]: converted };
    else delete fields[field.id];
  }

  if (collection.orderable !== false) {
    if (!id) {
      fields.order = { [LOCALE]: await nextOrder(type) };
    } else if (existing?.fields?.order?.[LOCALE] !== undefined) {
      fields.order = { [LOCALE]: existing.fields.order[LOCALE] };
    }
  }

  const slugField = collection.fields.find((field) => field.id === "slug");
  if (slugField) {
    const sources = collection.slugFrom ?? (collection.titleField ? [collection.titleField] : []);
    const base = buildSlug(sources.map((fieldId) => resolved[fieldId] as string | undefined));

    const current = fields.slug?.[LOCALE];
    const typed = typeof current === "string" ? current : "";
    const currentSlug = typed ? cleanSlug(typed) : "";

    if (typed && currentSlug && currentSlug !== typed) {
      fields.slug = { [LOCALE]: currentSlug };
    }

    const previousBase = collection.slugFollowsTitle
      ? buildSlug(
          sources.map((fieldId) => existing?.fields?.[fieldId]?.[LOCALE] as string | undefined)
        )
      : "";
    const wasGenerated =
      previousBase.length > 0 &&
      (currentSlug === previousBase || new RegExp(`^${previousBase}-\\d+$`).test(currentSlug));

    if (base && (!currentSlug || wasGenerated)) {
      fields.slug = { [LOCALE]: await uniqueSlug(type, base, id) };
    }
  }

  await publishLinkedAssets(fields);

  const path = id ? `/entries/${id}` : "/entries";
  const saved = await cma(path, {
    method: id ? "PUT" : "POST",
    version: existing?.sys?.version,
    contentType: id ? undefined : type,
    body: { fields },
  });

  try {
    const publishedEntry = await cma(`/entries/${saved.sys.id}/published`, {
      method: "PUT",
      version: saved.sys.version,
    });
    if (!publishedEntry?.sys?.publishedVersion) {
      throw new Error("Saved, but it could not be published");
    }
  } catch (error) {
    if (error instanceof CmaError) {
      const messages = error.validationMessages();
      if (messages.length > 0) {
        throw new Error(`Please fix this first: ${messages.join(" ")}`);
      }
    }
    throw error;
  }

  return { id: saved.sys.id };
}

export async function setEntryPublished(id: string, published: boolean) {
  const entry = await cma(`/entries/${id}`);
  if (!entry) throw new Error("That item no longer exists");

  if (published) {
    await cma(`/entries/${id}/published`, { method: "PUT", version: entry.sys.version });
  } else {
    await cma(`/entries/${id}/published`, { method: "DELETE", version: entry.sys.version });
  }
}

export interface SearchableEntry {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  published: boolean;
  updatedAt: string;
}

export async function searchableEntries(): Promise<{
  entries: SearchableEntry[];
  raw: CmaEntryItem[];
}> {
  const [items, collections] = await Promise.all([
    cmaAll("/entries?order=-sys.updatedAt"),
    loadCollections(),
  ]);
  const byType = new Map(collections.map((collection) => [collection.type, collection] as const));

  const found: SearchableEntry[] = [];
  for (const item of items) {
    const type = item.sys?.contentType?.sys?.id;
    const collection = type ? byType.get(type) : undefined;
    if (!collection) continue;

    found.push({
      id: item.sys.id,
      title: titleOf(collection, item.fields ?? {}, item.sys.id),
      type: collection.type,
      typeLabel: collection.label,
      published: Boolean(item.sys.publishedVersion),
      updatedAt: item.sys.updatedAt,
    });
  }
  return { entries: found, raw: items };
}

export async function referenceOptions(refType: string): Promise<RefOption[]> {
  const target = await findCollection(refType);
  const items = await cmaAll(`/entries?content_type=${refType}&order=-sys.updatedAt`);

  return items.map(
    (item: { sys: { id: string }; fields?: RawFields }) => ({
      id: item.sys.id,
      label: target
        ? titleOf(target, item.fields ?? {}, item.sys.id)
        : item.sys.id,
    })
  );
}

export interface DeleteBlocker {
  id: string;
  title: string;
  type: string;
}

export async function entriesLinkingTo(id: string): Promise<DeleteBlocker[]> {
  const items = await cmaAll(`/entries?links_to_entry=${encodeURIComponent(id)}`);

  return items.map((item) => {
    const type = item.sys?.contentType?.sys?.id ?? "";
    const collection = COLLECTIONS.find((entry) => entry.type === type);
    const fields = (item.fields ?? {}) as RawFields;
    return {
      id: item.sys.id,
      title: collection ? titleOf(collection, fields, item.sys.id) : item.sys.id,
      type,
    };
  });
}

export async function deleteEntry(id: string) {
  const entry = await cma(`/entries/${id}`);
  if (!entry) throw new Error("not found");

  if (entry.sys.publishedVersion) {
    await cma(`/entries/${id}/published`, {
      method: "DELETE",
      version: entry.sys.version,
    });
  }

  const current = await cma(`/entries/${id}`);
  await cma(`/entries/${id}`, { method: "DELETE", version: current.sys.version });
}
