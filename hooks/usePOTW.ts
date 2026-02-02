
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

export interface POTWItem {
  _id: string;
  image: {
    url: string;
    description: string;
    title: string;
  };
  description: {
    json: any;
  };
  linkedin?: string;
}

interface POTWCollection {
  personalityOfTheWeekCollection: {
    items: POTWItem[]
  }
}

const GET_POTW = gql`
 query PersonalityOfTheWeekCollection {
  personalityOfTheWeekCollection {
    items {
      _id
      image {
        url
        description
        title
      }
      description {
        json
      }
      linkedin
    }
  }
}`

export const usePOTW = () => {
  return useQuery({
    queryKey: ["pots"],
    queryFn: async () => {
      const data = await contentfulClient.request<POTWCollection>(GET_POTW);
      if (data.personalityOfTheWeekCollection.items.length === 0) {
        return null;
      }
      return data.personalityOfTheWeekCollection.items;
    },
  });
};
