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

// How long (seconds) a cached Contentful response is served before revalidation.
// Because this cache lives on the server, one refresh serves every visitor, so
// the number of origin calls stays roughly constant regardless of traffic.
export const CONTENTFUL_REVALIDATE_SECONDS = 3600;

export const CONTENTFUL_CACHE_TAG = "contentful";

// `next` is a Next.js fetch extension not covered by graphql-request's types.
type GraphQLClientConfig = ConstructorParameters<typeof GraphQLClient>[1];
type NextRequestConfig = GraphQLClientConfig & {
  next?: { revalidate?: number | false; tags?: string[] };
};

const requestConfig: NextRequestConfig = {
  // GET (rather than POST) lets responses flow through Next's Data Cache / CDN.
  method: "GET",
  headers: CONTENTFUL_ACCESS_TOKEN
    ? { Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}` }
    : {},
  next: { revalidate: CONTENTFUL_REVALIDATE_SECONDS, tags: [CONTENTFUL_CACHE_TAG] },
};

/**
 * Direct client to the Contentful GraphQL API. Intended for server-side use
 * (Server Components, route handlers) where the `next.revalidate` Data Cache
 * is shared across all requests/users.
 */
export const contentfulDirect = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID ?? "undefined"}`,
  requestConfig
);

interface PartialErrorShape {
  response?: { data?: unknown; errors?: { message?: string }[] };
}

/**
 * Contentful answers HTTP 200 with usable `data` alongside non-fatal errors
 * such as UNRESOLVABLE_LINK (a published entry pointing at an unpublished
 * asset). graphql-request throws on any `errors`, which would take a whole page
 * down over one missing image, so partial data is served and logged instead.
 */
export async function requestTolerant<T>(query: string, variables?: Variables): Promise<T> {
  try {
    return await contentfulDirect.request<T>(query, variables);
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
  // On the server, hit Contentful directly so we benefit from the shared
  // Data Cache. In the browser, proxy through our own route handler so the
  // response is served from that same server-side cache — this keeps origin
  // calls flat no matter how many people are online, and keeps the access
  // token off the client.
  if (typeof window === "undefined") {
    return requestTolerant<T>(query, variables);
  }

  const params = new URLSearchParams({ query });
  if (variables && Object.keys(variables).length > 0) {
    params.set("variables", JSON.stringify(variables));
  }

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

/**
 * Isomorphic Contentful client. Mirrors `graphql-request`'s `.request` API so
 * existing call sites stay unchanged while transparently caching on the server.
 */
export const contentfulClient = { request };
