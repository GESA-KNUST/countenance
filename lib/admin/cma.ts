export const LOCALE = "en-US";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENVIRONMENT}`;
export const UPLOAD_BASE = `https://upload.contentful.com/spaces/${SPACE}`;

export function isWriteConfigured() {
  return Boolean(SPACE && TOKEN);
}

export function managementToken() {
  if (!TOKEN) throw new Error("CONTENTFUL_MANAGEMENT_TOKEN is not set");
  return TOKEN;
}

interface CmaOptions {
  method?: string;
  body?: unknown;
  version?: number;
  contentType?: string;
}

export async function cma(pathname: string, options: CmaOptions = {}) {
  const { method = "GET", body, version, contentType } = options;

  const headers: Record<string, string> = { Authorization: `Bearer ${managementToken()}` };
  if (body !== undefined) {
    headers["Content-Type"] = "application/vnd.contentful.management.v1+json";
  }
  if (version !== undefined) headers["X-Contentful-Version"] = String(version);
  if (contentType) headers["X-Contentful-Content-Type"] = contentType;

  const send = () =>
    fetch(`${BASE}${pathname}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

  let res = await send();

  if (res.status === 429) {
    const wait = Number(res.headers.get("x-contentful-ratelimit-reset") ?? 1);
    await new Promise((resolve) => setTimeout(resolve, Math.min(wait, 5) * 1000));
    res = await send();
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    const raw = await res.text();
    throw new CmaError(`${method} ${pathname} -> ${res.status}`, res.status, raw);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const PAGE_SIZE = 200;
const MAX_PAGES = 50;

export class CmaError extends Error {
  readonly status: number;
  readonly raw: string;

  constructor(message: string, status: number, raw: string) {
    super(`${message} ${raw}`);
    this.name = "CmaError";
    this.status = status;
    this.raw = raw;
  }

  validationMessages(): string[] {
    try {
      const body = JSON.parse(this.raw);
      const errors = body?.details?.errors ?? [];
      return errors
        .map((error: { customMessage?: string; details?: string }) =>
          (error.customMessage ?? error.details ?? "").trim()
        )
        .filter((message: string) => message.length > 0);
    } catch {
      return [];
    }
  }
}

export interface CmaEntryItem {
  sys: {
    id: string;
    version: number;
    updatedAt: string;
    publishedVersion?: number;
    contentType?: { sys: { id: string } };
  };
  fields?: Record<string, Record<string, unknown> | undefined>;
}

export async function cmaAll<T = CmaEntryItem>(pathname: string): Promise<T[]> {
  // Contentful rejects duplicate query parameters, so strip any limit/skip the
  // caller supplied before this helper adds its own.
  const [base, rawQuery = ""] = pathname.split("?");
  const params = new URLSearchParams(rawQuery);
  params.delete("limit");
  params.delete("skip");

  const cleaned = params.toString();
  pathname = cleaned ? `${base}?${cleaned}` : base;

  const joiner = pathname.includes("?") ? "&" : "?";
  const collected: T[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const skip = page * PAGE_SIZE;
    const response = await cma(`${pathname}${joiner}limit=${PAGE_SIZE}&skip=${skip}`);
    const items = response?.items ?? [];
    collected.push(...items);

    const total = typeof response?.total === "number" ? response.total : collected.length;
    if (items.length === 0 || collected.length >= total) break;
  }

  return collected;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    out.push(items.slice(index, index + size));
  }
  return out;
}

export const assetLink = (id: string) => ({
  sys: { type: "Link", linkType: "Asset", id },
});

export const entryLink = (id: string) => ({
  sys: { type: "Link", linkType: "Entry", id },
});

export interface AssetLinkField {
  sys?: { id?: string };
}

export function linkIds(links: AssetLinkField[] | undefined): string[] {
  return (links ?? [])
    .map((link) => link?.sys?.id)
    .filter((id): id is string => Boolean(id));
}
