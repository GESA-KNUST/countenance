import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

interface Announcement {
    actionLink: string;
    description: string;
    dueDate: string;
    title: string;
    _id: string;
}

interface AnnouncementCollection {
    announcementsCollection: {
        items: Announcement[];
    }
}

const GET_ANNOUNCEMENTS = gql`
    query AnnouncementsCollection {
  announcementsCollection {
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

export const useAnnouncements = () => {
    return useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            const data = await contentfulClient.request<AnnouncementCollection>(GET_ANNOUNCEMENTS);
            if (data.announcementsCollection.items.length === 0) {
                return null;
            }
            return data.announcementsCollection.items;
        },
    });
};
