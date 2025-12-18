'use client';
import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/lib/contentful-client";

export interface Gallery {
  sys: { id: string };
  eventName: string;
  picturesLink: string;
  sampleImagesCollection: {
    items: {
      title: string;
      description: string;
      url: string;
    }[];
  };
}

const GET_GALLERY_COLLECTION = gql`
  query Query($galleryGroupId: String!) {
    galleryGroup(id: $galleryGroupId) {
      sys { id }
      eventName
      picturesLink
      sampleImagesCollection {
        items {
          title
          description
          url
        }
      }
    }
  }
`;

const GET_GALLERIES = gql`
  query GetGalleries {
    galleryGroupCollection {
      items {
        sys { id }
        eventName
        picturesLink
        sampleImagesCollection(limit: 5) {
          items {
            title
            description
            url
          }
        }
      }
    }
  }
`;

export const useGalleries = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      const { galleryGroupCollection } = await contentfulClient.request<{
        galleryGroupCollection: { items: Gallery[] };
      }>(GET_GALLERIES);
      return galleryGroupCollection.items;
    },
  });

  return { data, isLoading, error };
};

export const useGalleryCollection = (galleryGroupId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gallery", galleryGroupId],
    queryFn: async () => {
      if (!galleryGroupId) return null;
      const { galleryGroup } = await contentfulClient.request<{ galleryGroup: Gallery }>(
        GET_GALLERY_COLLECTION,
        { galleryGroupId }
      );
      return galleryGroup;
    },
    enabled: !!galleryGroupId,
  });

  return { data, isLoading, error };
};
