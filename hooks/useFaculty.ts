import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface FacultyData {
    name: string;
    about: string;
    mission: string;
    vision: string;
    facultyWebsite: string;
    facultyLinkedIn: string;
    facultyTwitter: string;
    facultyMail: string;
    departmentsUnderFacultyCollection: {
        items: {
            sys: { id: string };
            name: string;
            deptAbbreviation: string;
            deptLogo: {
                title: string;
                description: string;
                url: string;
            };
        }[];
    };
    facultyMainImageCollection: {
        items: {
            title: string;
            description: string;
            url: string;
        }[];
    };
}

interface Props {
    faculty: FacultyData;
}

const GET_FACULTY = gql`
  query Faculty($facultyId: String!) {
    faculty(id: $facultyId) {
      name
      about
      departmentsUnderFacultyCollection {
        items {
          sys {
            id
          }
          name
          deptAbbreviation
          deptLogo {
            title
            description
            url
          }
        }
      }
      mission
      vision
      facultyWebsite
      facultyLinkedIn
      facultyTwitter
      facultyMail
      facultyMainImageCollection {
        items {
          title
          description
          url
        }
      }
    }
  }
`;

export const useFaculty = (id: string) => {
    return useFetchData<FacultyData>({
        queryKey: ["faculty", id],
        queryFn: async () => {
            try {
                const data = await contentfulClient.request<Props>(GET_FACULTY, {
                    facultyId: id,
                });
                return data.faculty;
            } catch (err: any) {
                console.error("Error fetching faculty:", err);
                throw err;
            }
        },
        enabled: !!id,
    });
};
