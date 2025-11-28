import { GraphQLClient } from "graphql-request";

const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!;

export const contentfulClient = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
  {
    headers: {
      Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
    },
  }
);
