import { ctfSrc } from "../contentful-src";
import type { EventItem } from "../data/event";
import { ORGANIZATION_ID, ORGANIZATION_NAME, SITE_URL, absoluteUrl } from "./site";

const ORGANIZER = {
  "@id": ORGANIZATION_ID,
  "@type": "Organization",
  name: ORGANIZATION_NAME,
  url: SITE_URL,
};

function eventImage(event: EventItem) {
  return event.eventImage?.url ? ctfSrc(event.eventImage.url, 1200, { height: 630 }) : undefined;
}

function eventLocation(event: EventItem) {
  if (event.onlineLink) {
    return {
      "@type": "VirtualLocation",
      url: event.onlineLink,
    };
  }

  if (event.venueInPlainEnglish) {
    return {
      "@type": "Place",
      name: event.venueInPlainEnglish,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kumasi",
        addressCountry: "GH",
      },
      ...(event.venue
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.venue.lat,
              longitude: event.venue.lon,
            },
          }
        : {}),
    };
  }

  return {
    "@type": "Place",
    name: "Kwame Nkrumah University of Science and Technology",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kumasi",
      addressCountry: "GH",
    },
  };
}

export function eventSchema(event: EventItem) {
  const url = absoluteUrl(`/events/${event.slug}`);
  const starts = Date.parse(event.eventDate);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: event.title,
    url,
    ...(Number.isNaN(starts) ? {} : { startDate: new Date(starts).toISOString() }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.onlineLink
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    ...(event.description ? { description: event.description.slice(0, 500) } : {}),
    ...(eventImage(event) ? { image: eventImage(event) } : {}),
    location: eventLocation(event),
    organizer: ORGANIZER,
    performer: ORGANIZER,
    isAccessibleForFree: true,
  };
}

export function eventListSchema(events: EventItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/events/#events`,
    name: "GESA-KNUST events",
    url: `${SITE_URL}/events`,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/events/${event.slug}`),
      name: event.title,
    })),
  };
}
