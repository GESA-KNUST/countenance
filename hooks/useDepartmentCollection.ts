import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

export interface DepartmentSummary {
    sys: {
        id: string;
    };
    name: string;
    deptAbbreviation: string;
    deptLogo: {
        url: string;
    };
}

interface Props {
    departmentCollection: {
        items: DepartmentSummary[];
    };
}

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departmentCollection {
      items {
        sys {
          id
        }
        name
        deptAbbreviation
        deptLogo {
          url
        }
      }
    }
  }
`;

export const useDepartmentCollection = () => {
    return useFetchData({
        queryKey: ["departments"],
        queryFn: async () => {
            try {
                const data = await contentfulClient.request<Props>(GET_DEPARTMENTS);
                return data.departmentCollection.items;
            } catch (err: any) {
                throw err;
            }
        },
    });
};
