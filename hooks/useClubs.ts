import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

export interface ClubItems {
  sys: {
    id: string
  }
  clubLink: string
  clubLogo: {
    description: string
    url: string
    title: string
  }
  clubName: string
  clubType: string
  description: string
  isFeatured: boolean
  isActivelyRecruitingMembers: boolean
  aboutclub: {
    json: any
    links: {
      assets: {
        block: {
          sys: {
            id: string
          }
          url: string
          title: string
          description: string
          width: number
          height: number
        }[]
      }
    }
  }
}

interface ClubCollection {
  clubCollection: {
    items: ClubItems[]
  }
}


const GET_CLUBS = gql`
query ClubCollection {
  clubCollection {
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

const GET_CLUB_BY_ID = gql`
query ClubById($id: String!) {
  clubCollection(where: { sys: { id: $id } }, limit: 1) {
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
      aboutclub {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              url
              title
              description
              width
              height
            }
          }
        }
      }
    }
  }
}
`;

export const useClubs = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const data = await contentfulClient.request<ClubCollection>(GET_CLUBS);
      return data.clubCollection.items;
    },
  });
};

export const useClubById = (id: string) => {
  return useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const data = await contentfulClient.request<ClubCollection>(GET_CLUB_BY_ID, { id });
      return data.clubCollection.items[0];
    },
    enabled: !!id,
  });
};
