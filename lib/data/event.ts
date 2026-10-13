import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";

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

interface EventResponse {
  eventCardCollection: {
    items: EventItem[];
  };
}

const EVENT_FIELDS = `_id
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
        }`;

export const GET_EVENTS = gql`
  query EventCardCollection {
    eventCardCollection(order: [order_ASC]) {
      items {
        ${EVENT_FIELDS}
      }
    }
  }
`;

export const GET_EVENT_BY_SLUG = gql`
  query EventCardBySlug($slug: String!) {
    eventCardCollection(where: { slug: $slug }, limit: 1) {
      items {
        ${EVENT_FIELDS}
      }
    }
  }
`;

export async function getEvents(): Promise<EventItem[]> {
  const data = await contentfulClient.request<EventResponse>(GET_EVENTS);
  return data.eventCardCollection.items ?? [];
}

export async function getEventsSafe(): Promise<EventItem[]> {
  try {
    return await getEvents();
  } catch (error) {
    LogError("[getEvents]", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const data = await contentfulClient.request<EventResponse>(GET_EVENT_BY_SLUG, { slug });
    return data.eventCardCollection.items[0] ?? null;
  } catch (error) {
    LogError("Failed to fetch event for metadata", error);
    return null;
  }
}
