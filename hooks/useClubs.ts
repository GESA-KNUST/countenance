import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

export interface ClubItems {
    clubLink: string
    clubLogo: {
        description: string
        url: string
        title: string
    }
    clubName: string
    clubType: string
    description: string
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
      clubLink
      clubLogo {
        description
        url
        title
      }
      clubName
      clubType
      description
    }
  }
}
`;

export const useClubs = () => {
    return useQuery({
        queryKey: ["clubs"],
        queryFn: async () => {
            const data = await contentfulClient.request<ClubCollection>(GET_CLUBS);
            if (data.clubCollection.items.length === 0) {
                return null;
            }
            return data.clubCollection.items;
        },
    });
};
