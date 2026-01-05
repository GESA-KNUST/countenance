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
    links: {
      assets: {
        block: {
          sys: {
            id: string;
          };
          url: string;
          title: string;
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
  departmentCollection: {
    items: DepartmentData[];
  };
}

const GET_DEPARTMENT = gql`
  query GetDepartment($id: String!) {
    departmentCollection(where: { sys: { id: $id } }, limit: 1) {
      items {
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
                title
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
  }
`;

export const useDepartment = (id: string) => {
  return useFetchData({
    queryKey: ["department", id],
    queryFn: async () => {
      try {
        const data = await contentfulClient.request<Props>(GET_DEPARTMENT, {
          id,
        });
        return data.departmentCollection.items[0];
      } catch (err: any) {
        throw err;
      }
    },
    enabled: !!id,
  });
};
