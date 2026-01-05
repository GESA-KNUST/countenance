import { GraphQLClient } from "graphql-request";

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error(
    "Contentful environment variables are missing!",
    {
      spaceId: CONTENTFUL_SPACE_ID ? "present" : "missing",
      accessToken: CONTENTFUL_ACCESS_TOKEN ? "present" : "missing",
    }
  );
}

export const contentfulClient = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID || "undefined"}`,
  {
    method: 'GET',
    headers: {
      ...(CONTENTFUL_ACCESS_TOKEN ? { Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}` } : {}),
    },
    // @ts-ignore 
    next: { revalidate: 3600 },
  }
);
