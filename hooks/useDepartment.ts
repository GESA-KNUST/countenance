import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface DepartmentData {
  name: string;
  deptAbbreviation: string;
  deptLogo: {
    title: string;
    description: string;
    url: string;
  };
  vision: {
    json: any;
  };
  about: {
    json: any;
    links?: {
      assets: {
        block: {
          sys: { id: string };
          url: string;
          description: string;
          width: number;
          height: number;
        }[];
      };
    };
  };
  mission: {
    json: any;
  };
  websiteLink: string;
  deptPhone: string;
  deptLinkedIn: string;
  whatsappLink: string;
  xComLink: string;
  tiktokLink: string;
  deptEmail: string;
}

interface Props {
  department: DepartmentData;
}

const GET_DEPARTMENT = gql`
  query GetDepartment($id: String!) {
    department(id: $id) {
        name
        deptAbbreviation
        deptLogo {
          title
          description
          url
        }
        vision {
          json
        }
        about {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                description
                width
                height
              }
            }
          }
        }
        mission {
          json
        }
        websiteLink
        deptPhone
        deptLinkedIn
        whatsappLink
        xComLink
        tiktokLink
        deptEmail
    }
  }
`;

export const useDepartment = (id: string) => {
  return useFetchData<DepartmentData>({
    queryKey: ["department", id],
    queryFn: async () => {
      try {
        const data = await contentfulClient.request<Props>(GET_DEPARTMENT, {
          id,
        });
        return data.department;
      } catch (err: any) {
        console.error("Error fetching department:", err);
        throw err;
      }
    },
    enabled: !!id,
  });
};
