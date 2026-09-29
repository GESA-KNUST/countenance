import { cma } from "./cma";
import type { CollectionSpec, FieldKind, FieldSpec } from "./collections";

const NEVER_GENERATE = new Set(["pageHero", "galleryImage", "siteManager", "authorIdentity"]);

interface Validation {
  in?: unknown[];
  linkContentType?: string[];
}

interface ContentTypeField {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  omitted?: boolean;
  linkType?: string;
  items?: { type?: string; linkType?: string; validations?: Validation[] };
  validations?: Validation[];
}

interface ContentType {
  sys: { id: string };
  name?: string;
  description?: string | null;
  displayField?: string | null;
  fields?: ContentTypeField[];
}

function singleRefType(validations: Validation[] | undefined): string | undefined {
  const link = validations?.find(
    (validation) => Array.isArray(validation.linkContentType) && validation.linkContentType.length === 1
  );
  return link?.linkContentType?.[0];
}

function selectOptions(validations: Validation[] | undefined) {
  const list = validations?.find((validation) => Array.isArray(validation.in))?.in;
  if (!list || list.length === 0) return undefined;
  return list
    .filter((value): value is string => typeof value === "string")
    .map((value) => ({ value, label: value }));
}

function mapField(field: ContentTypeField): FieldSpec | null {
  const base = { id: field.id, label: field.name || field.id, required: field.required };
  const withKind = (kind: FieldKind, extra: Partial<FieldSpec> = {}): FieldSpec => ({
    ...base,
    kind,
    ...extra,
  });

  switch (field.type) {
    case "Symbol": {
      const options = selectOptions(field.validations);
      return options ? withKind("select", { options }) : withKind("text");
    }
    case "Text":
      return withKind("longtext");
    case "RichText":
      return withKind("richtext");
    case "Boolean":
      return withKind("boolean");
    case "Date":
      return withKind("date");
    case "Integer":
    case "Number":
      return withKind("number");
    case "Location":
      return withKind("location");
    case "Link":
      if (field.linkType === "Asset") return withKind("image");
      if (field.linkType === "Entry")
        return withKind("entryRef", { refType: singleRefType(field.validations) });
      return null;
    case "Array": {
      const items = field.items;
      if (items?.type === "Symbol") return withKind("stringList");
      if (items?.type === "Link" && items.linkType === "Asset") return withKind("images");
      if (items?.type === "Link" && items.linkType === "Entry")
        return withKind("entryRefs", { refType: singleRefType(items.validations) });
      return null;
    }
    default:

      return null;
  }
}

function specFrom(contentType: ContentType): CollectionSpec | null {
  const rawFields = (contentType.fields ?? []).filter(
    (field) => !field.disabled && !field.omitted && field.id !== "order"
  );

  const fields: FieldSpec[] = [];
  for (const field of rawFields) {
    const mapped = mapField(field);
    if (mapped) fields.push(mapped);
  }
  if (fields.length === 0) return null;

  const label = contentType.name?.trim() || contentType.sys.id;
  const display = contentType.displayField;
  const titleField =
    (display && fields.some((field) => field.id === display) ? display : undefined) ??
    fields.find((field) => field.kind === "text")?.id ??
    fields[0].id;

  const thumbField = fields.find((field) => field.kind === "image" || field.kind === "images")?.id;

  const orderable = (contentType.fields ?? []).some(
    (field) => field.id === "order" && (field.type === "Integer" || field.type === "Number")
  );

  return {
    type: contentType.sys.id,
    label,
    singular: label.toLowerCase(),
    hint: contentType.description?.trim() || `Everything in ${label}`,
    titleField,
    thumbField,
    orderable,
    generated: true,
    fields,
  };
}

/**
 * The content model changes a few times a year, but every admin page asked
 * Contentful for it. Holding it for a few minutes removes a management API
 * call from each page view without anyone noticing a delay.
 */
const MODEL_TTL_MS = 5 * 60 * 1000;
let modelCache: { at: number; items: ContentType[] } | null = null;

async function contentTypes(): Promise<ContentType[]> {
  if (modelCache && Date.now() - modelCache.at < MODEL_TTL_MS) {
    return modelCache.items;
  }

  const response = (await cma("/content_types?limit=1000")) as { items?: ContentType[] } | null;
  const items = response?.items ?? [];
  modelCache = { at: Date.now(), items };
  return items;
}

export async function generatedCollections(handAuthored: Set<string>): Promise<CollectionSpec[]> {
  let items: ContentType[] = [];
  try {
    items = await contentTypes();
  } catch {
    return [];
  }

  const specs: CollectionSpec[] = [];
  for (const contentType of items) {
    if (!contentType?.sys?.id || handAuthored.has(contentType.sys.id)) continue;
    if (NEVER_GENERATE.has(contentType.sys.id)) continue;
    const spec = specFrom(contentType);
    if (spec) specs.push(spec);
  }
  return specs;
}
