import { gql } from "graphql-request";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

export interface FacultySummary {
  sys: { id: string };
  name: string;
  facultyMainImageCollection: { items: { url: string }[] };
}

interface FacultyCollection {
  facultyCollection: { items: FacultySummary[] };
}

const GET_FACULTIES = gql`
  query GetFaculties {
    facultyCollection(order: [order_ASC]) {
      items {
        sys {
          id
        }
        name
        facultyMainImageCollection(limit: 1) {
          items {
            url
          }
        }
      }
    }
  }
`;

export async function getFaculties(): Promise<FacultySummary[]> {
  const data = await contentfulClient.request<FacultyCollection>(GET_FACULTIES);
  return data.facultyCollection.items ?? [];
}

export async function getFacultiesSafe(): Promise<FacultySummary[]> {
  try {
    return await getFaculties();
  } catch (error) {
    LogError("[getFaculties]", error);
    return [];
  }
}
