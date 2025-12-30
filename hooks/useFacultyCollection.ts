import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface FacultySummary {
  _id: string;
  name: string;
  abbreviation: string;
  logo: {
    url: string;
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
        _id
        name
        abbreviation
        logo {
          url
        }
      }
    }
  }
`;

const MOCK_FACULTIES: FacultySummary[] = [
  {
    _id: "1",
    name: "Faculty of Civil and Geomatic Engineering",
    abbreviation: "FCGE",
    logo: { url: "/images/img1.png" }
  },
  {
    _id: "2",
    name: "Faculty of Electrical and Computer Engineering",
    abbreviation: "FECE",
    logo: { url: "/images/img1.png" }
  },
  {
    _id: "3",
    name: "Faculty of Mechanical and Chemical Engineering",
    abbreviation: "FMCE",
    logo: { url: "/images/img1.png" }
  }
];

export const useFacultyCollection = () => {
  return useFetchData<FacultySummary[]>({
    queryKey: ["faculties"],
    queryFn: async () => {
      return MOCK_FACULTIES;
      /* 
      try {
          const data = await contentfulClient.request<Props>(GET_FACULTIES);
          return data.facultyCollection.items;
      } catch (err: any) {
          throw err;
      }
      */
    },
  });
};
