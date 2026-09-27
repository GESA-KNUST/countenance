import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface POTWItem {
  sys: {
    id: string;
  };
  image: {
    url: string;
    description: string;
    title: string;
  };
  description: {
    json: any;
    links?: {
      assets: {
        block: {
          sys: { id: string };
          url: string;
          title: string | null;
          description: string | null;
          width: number | null;
          height: number | null;
        }[];
      };
    };
  };
  linkedinUrl?: string;
}

interface POTWCollection {
  personalityOfTheWeekCollection: {
    items: POTWItem[]
  }
}

const GET_POTW = gql`
 query PersonalityOfTheWeekCollection {
  personalityOfTheWeekCollection(order: [order_ASC], limit: 1) {
    items {
      sys {
        id
      }
      image {
        url
        description
        title
      }
      description {
        json
        links {
          assets {
            block {
              sys { id }
              url
              title
              description
              width
              height
            }
          }
        }
      }
      linkedinUrl
    }
  }
}`

export const usePOTW = () => {
  return useFetchData({
    queryKey: ["potw"],
    queryFn: async () => {
      const data = await contentfulClient.request<POTWCollection>(GET_POTW);
      if (data.personalityOfTheWeekCollection.items.length === 0) {
        return null;
      }
      return data.personalityOfTheWeekCollection.items;
    },
  });
};
