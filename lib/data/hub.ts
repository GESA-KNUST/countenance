import { gql } from "graphql-request";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

export interface HubItem {
  title: string;
  _id: string;
  description: string;
  opportunityType: string;
  source: string;
  applicationDeadline: string;
}

export interface Announcement {
  actionLink: string;
  description: string;
  dueDate: string;
  title: string;
  _id: string;
}

interface HubCollection {
  hubCollection: { items: HubItem[] };
}

interface AnnouncementCollection {
  announcementsCollection: { items: Announcement[] };
}

const GET_HUBS = gql`
  query Items {
    hubCollection(order: [order_ASC]) {
      items {
        title
        _id
        description
        opportunityType
        source
        applicationDeadline
      }
    }
  }
`;

const GET_ANNOUNCEMENTS = gql`
  query AnnouncementsCollection {
    announcementsCollection(order: [order_ASC]) {
      items {
        actionLink
        description
        dueDate
        title
        _id
      }
    }
  }
`;

export async function getHubs(): Promise<HubItem[] | null> {
  const data = await contentfulClient.request<HubCollection>(GET_HUBS);
  const items = data.hubCollection.items ?? [];
  return items.length === 0 ? null : items;
}

export async function getAnnouncements(): Promise<Announcement[] | null> {
  const data = await contentfulClient.request<AnnouncementCollection>(GET_ANNOUNCEMENTS);
  const items = data.announcementsCollection.items ?? [];
  return items.length === 0 ? null : items;
}

export async function getHubsSafe(): Promise<HubItem[] | null> {
  try {
    return await getHubs();
  } catch (error) {
    LogError("[getHubs]", error);
    return null;
  }
}

export async function getAnnouncementsSafe(): Promise<Announcement[] | null> {
  try {
    return await getAnnouncements();
  } catch (error) {
    LogError("[getAnnouncements]", error);
    return null;
  }
}
