import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";
import type { EventItem } from "@/hooks/useEventCollection";

interface EventResponse {
  eventCardCollection: {
    items: EventItem[];
  };
}

const GET_EVENT_BY_SLUG = gql`
  query EventCardBySlug($slug: String!) {
    eventCardCollection(where: { slug: $slug }, limit: 1) {
      items {
        _id
        title
        slug
        eventDate
        description
        venueInPlainEnglish
        eventImage {
          url
          description
        }
      }
    }
  }
`;

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const data = await contentfulClient.request<EventResponse>(GET_EVENT_BY_SLUG, { slug });
    return data.eventCardCollection.items[0] ?? null;
  } catch (error) {
    LogError("Failed to fetch event for metadata", error);
    return null;
  }
}
