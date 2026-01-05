import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface FacultySummary {
  sys: {
    id: string;
  };
  name: string;
  facultyMainImageCollection: {
    items: {
      url: string;
    }[];
  };
}

interface Props {
  facultyCollection: {
    items: FacultySummary[];
  };
}

const GET_FACULTIES = gql`
  query GetFaculties {
    facultyCollection {
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

export const useFacultyCollection = () => {
  return useFetchData<FacultySummary[]>({
    queryKey: ["faculties"],
    queryFn: async () => {
      try {
        const data = await contentfulClient.request<Props>(GET_FACULTIES);
        return data.facultyCollection.items;
      } catch (err: any) {
        console.error("Error fetching faculties:", err);
        throw err;
      }
    },
  });
};
