import { gql } from "graphql-request";
import type { Document } from "@contentful/rich-text-types";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

export interface ClubItems {
  sys: {
    id: string;
  };
  clubLink: string;
  clubLogo: {
    description: string;
    url: string;
    title: string;
  };
  clubName: string;
  clubType: string;
  description: string;
  isFeatured: boolean;
  isActivelyRecruitingMembers: boolean;
  aboutclub: {
    json: Document;
    links: {
      assets: {
        block: {
          sys: {
            id: string;
          };
          url: string;
          title: string;
          description: string;
          fileName?: string;
          width: number;
          height: number;
        }[];
      };
    };
  };
}

interface ClubCollection {
  clubCollection: {
    items: ClubItems[];
  };
}

const GET_CLUBS = gql`
  query ClubCollection {
    clubCollection(order: [order_ASC]) {
      items {
        sys {
          id
        }
        clubLink
        clubLogo {
          description
          url
          title
        }
        clubName
        clubType
        description
        isFeatured
        isActivelyRecruitingMembers
      }
    }
  }
`;

export async function getClubs(): Promise<ClubItems[]> {
  const data = await contentfulClient.request<ClubCollection>(GET_CLUBS);
  return data.clubCollection.items ?? [];
}

export async function getClubsSafe(): Promise<ClubItems[]> {
  try {
    return await getClubs();
  } catch (error) {
    LogError("[getClubs]", error);
    return [];
  }
}
