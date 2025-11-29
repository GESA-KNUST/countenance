import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface EventVenue {
  lat: number;
  lon: number;
}

export interface EventImage {
  description: string;
  url: string;
}

export interface EventItem {
  _id: string;
  slug: string;
  title: string;
  eventDate: string;
  description: string;
  venue: EventVenue;
  onlineLink?: string;
  eventImage: EventImage;
}

interface Props {
  eventCardCollection: {
    items: EventItem[];
  };
}

const GET_EVENTS = gql`
  query EventCardCollection {
    eventCardCollection {
      items {
        _id
        title
        slug
        eventDate
        description
        venue {
          lat
          lon
        }
        onlineLink
        eventImage {
          url
          description
        }
      }
    }
  }
`;

const useEventCollection = () => {
  return useFetchData({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const data = await contentfulClient.request<Props>(GET_EVENTS);
        return data.eventCardCollection.items;
      } catch (err: any) {
        throw err;
      }
    },
  });
};

export default useEventCollection;
