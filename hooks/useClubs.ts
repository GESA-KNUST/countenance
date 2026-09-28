import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
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

export const useClubs = () => {
  return useFetchData({
    queryKey: ["clubs"],
    queryFn: async () => {
      const data = await contentfulClient.request<ClubCollection>(GET_CLUBS);
      return data.clubCollection.items;
    },
  });
};
