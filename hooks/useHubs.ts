import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

export interface hubItem {
    title: string
    _id: string
    description: string
    opportunityType: string
    source: string
    applicationDeadline: string
}

interface HubCollection {
    hubCollection: {
        items: hubItem[]
    }
}

const GET_HUBS = gql`
query Items {
  hubCollection {
    items {
      title
      _id
      description
      opportunityType
      source
      applicationDeadline
    }
  }
}`

export const useHubs = () => {
  return useQuery({
    queryKey: ["hubs"],
    queryFn: async () => {
      const data = await contentfulClient.request<HubCollection>(GET_HUBS);
      if (data.hubCollection.items.length === 0) {
          return null;
      }
      return data.hubCollection.items;
    },
  });
};
