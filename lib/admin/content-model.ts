import { cma } from "./cma";
import type { CollectionSpec, FieldKind, FieldSpec } from "./collections";

/**
 * Turns Contentful's content model into collection specs so a content type that
 * was added in Contentful shows up in the admin without a code change. Hand
 * authored specs in COLLECTIONS still win — this only fills in the ones nobody
 * has written by hand yet, with best guesses for labels and field kinds.
 */

/**
 * Content types that already have a screen built for them, or that nothing on
 * the site reads. Generating an editor for these would give the same content
 * two different editors, or invite somebody to file photos into a dead model.
 */
const NEVER_GENERATE = new Set(["pageHero", "galleryImage"]);

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

/**
 * Maps a Contentful field to one of the editor's field kinds. Returns null for
 * kinds the editor cannot round-trip safely (numbers, JSON objects), so those
 * fields are left out rather than shown as a broken control.
 */
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
      // Object (JSON) and anything unknown have no matching control.
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
 * Reads every content type from Contentful and builds specs for the ones not
 * already hand authored. Returns [] if the model cannot be read, so the admin
 * still works from the hand authored list alone.
 */
export async function generatedCollections(handAuthored: Set<string>): Promise<CollectionSpec[]> {
  let response: { items?: ContentType[] } | null = null;
  try {
    response = await cma("/content_types?limit=1000");
  } catch {
    return [];
  }

  const items = response?.items ?? [];
  const specs: CollectionSpec[] = [];
  for (const contentType of items) {
    if (!contentType?.sys?.id || handAuthored.has(contentType.sys.id)) continue;
    if (NEVER_GENERATE.has(contentType.sys.id)) continue;
    const spec = specFrom(contentType);
    if (spec) specs.push(spec);
  }
  return specs;
}
