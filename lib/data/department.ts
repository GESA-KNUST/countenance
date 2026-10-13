import { gql } from "graphql-request";
import { contentfulClient } from "../contentful-client";
import { LogError } from "../logger";

export interface DepartmentSummary {
  sys: { id: string };
  name: string;
  deptAbbreviation: string;
  deptLogo: { url: string };
}

interface DepartmentCollection {
  departmentCollection: { items: DepartmentSummary[] };
}

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departmentCollection(order: [order_ASC]) {
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

export async function getDepartments(): Promise<DepartmentSummary[]> {
  const data = await contentfulClient.request<DepartmentCollection>(GET_DEPARTMENTS);
  return data.departmentCollection.items ?? [];
}

export async function getDepartmentsSafe(): Promise<DepartmentSummary[]> {
  try {
    return await getDepartments();
  } catch (error) {
    LogError("[getDepartments]", error);
    return [];
  }
}
