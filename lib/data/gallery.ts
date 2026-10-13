import { gql } from "graphql-request";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

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

const GET_GALLERY_GROUP = gql`
  query Query($galleryGroupId: String!) {
    galleryGroup(id: $galleryGroupId) {
      sys {
        id
      }
      eventName
      picturesLink
      sampleImagesCollection(limit: 50) {
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
    galleryGroupCollection(order: [order_ASC]) {
      items {
        sys {
          id
        }
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

export async function getGalleries(): Promise<Gallery[]> {
  const { galleryGroupCollection } = await contentfulClient.request<{
    galleryGroupCollection: { items: Gallery[] };
  }>(GET_GALLERIES);
  return galleryGroupCollection.items ?? [];
}

export async function getGalleriesSafe(): Promise<Gallery[]> {
  try {
    return await getGalleries();
  } catch (error) {
    LogError("[getGalleries]", error);
    return [];
  }
}

export async function getGalleryGroup(galleryGroupId: string): Promise<Gallery | null> {
  if (!galleryGroupId) return null;
  const { galleryGroup } = await contentfulClient.request<{ galleryGroup: Gallery }>(
    GET_GALLERY_GROUP,
    { galleryGroupId }
  );
  return galleryGroup ?? null;
}
