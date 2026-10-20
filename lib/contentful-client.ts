import { GraphQLClient, Variables } from "graphql-request";
import { LogError } from "./logger";

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  LogError("Contentful environment variables are missing!", {
    spaceId: CONTENTFUL_SPACE_ID ? "present" : "missing",
    accessToken: CONTENTFUL_ACCESS_TOKEN ? "present" : "missing",
  });
}

export const CONTENTFUL_REVALIDATE_SECONDS = 3600;

export const CONTENTFUL_CACHE_TAG = "contentful";

const CONTENTFUL_TIMEOUT_MS = 8000;

type GraphQLClientConfig = ConstructorParameters<typeof GraphQLClient>[1];
type NextRequestConfig = GraphQLClientConfig & {
  next?: { revalidate?: number | false; tags?: string[] };
};

const requestConfig: NextRequestConfig = {
  method: "GET",
  headers: CONTENTFUL_ACCESS_TOKEN
    ? { Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}` }
    : {},
  next: { revalidate: CONTENTFUL_REVALIDATE_SECONDS, tags: [CONTENTFUL_CACHE_TAG] },
};

export const contentfulDirect = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID ?? "undefined"}`,
  requestConfig
);

interface PartialErrorShape {
  response?: { data?: unknown; errors?: { message?: string }[] };
}

export async function requestTolerant<T>(query: string, variables?: Variables): Promise<T> {
  try {
    return await contentfulDirect.request<T>({
      document: query,
      variables,
      signal: AbortSignal.timeout(CONTENTFUL_TIMEOUT_MS),
    });
  } catch (error) {
    const partial = error as PartialErrorShape;
    const data = partial.response?.data;

    if (data && typeof data === "object") {
      const messages = (partial.response?.errors ?? [])
        .map((item) => item.message)
        .filter(Boolean);
      LogError("[contentful] serving partial data despite errors", messages);
      return data as T;
    }

    throw error;
  }
}

async function request<T>(query: string, variables?: Variables): Promise<T> {
  if (typeof window === "undefined") {
    return requestTolerant<T>(query, variables);
  }

  const params = new URLSearchParams({ query });
  if (variables && Object.keys(variables).length > 0) {
    params.set("variables", JSON.stringify(variables));
  }

  const version = (globalThis as { __contentVersion?: string }).__contentVersion;
  if (version) params.set("v", version);

  const url = `/api/contentful?${params.toString()}`;
  const res =
    url.length < 6000
      ? await fetch(url)
      : await fetch("/api/contentful", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `Contentful request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const contentfulClient = { request };
