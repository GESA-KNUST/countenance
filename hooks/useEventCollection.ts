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
  venueInPlainEnglish: string;
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
        venueInPlainEnglish
        onlineLink
        eventImage {
          url
          description
        }
      }
    }
  }
`;

const GET_EVENT_BY_SLUG = gql`
  query EventCardBySlug($slug: String!) {
    eventCardCollection(where: { slug: $slug }, limit: 1) {
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
        venueInPlainEnglish
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

export const useEventBySlug = (slug: string) => {
  return useFetchData({
    queryKey: ["event", slug],
    queryFn: async () => {
      try {
        const data = await contentfulClient.request<Props>(GET_EVENT_BY_SLUG, {
          slug,
        });
        return data.eventCardCollection.items[0];
      } catch (err: any) {
        throw err;
      }
    },
    enabled: !!slug,
  });
};

export default useEventCollection;
