import { gql } from "graphql-request";
import { requestTolerant } from "../contentful-client";
import { LogError } from "../logger";
import { orgSlug } from "./org-slug";

export interface OrgEntry {
  id: string;
  name: string;
  slug: string;
}

const GET_DEPARTMENT_INDEX = gql`
  query DepartmentIndex {
    departmentCollection(limit: 100) {
      items {
        sys {
          id
        }
        name
        deptAbbreviation
      }
    }
  }
`;

const GET_FACULTY_INDEX = gql`
  query FacultyIndex {
    facultyCollection(limit: 100) {
      items {
        sys {
          id
        }
        name
      }
    }
  }
`;

interface DepartmentIndex {
  departmentCollection: {
    items: { sys: { id: string }; name: string | null; deptAbbreviation: string | null }[];
  };
}

interface FacultyIndex {
  facultyCollection: { items: { sys: { id: string }; name: string | null }[] };
}

export async function departmentIndex(): Promise<OrgEntry[]> {
  try {
    const data = await requestTolerant<DepartmentIndex>(GET_DEPARTMENT_INDEX);
    return (data.departmentCollection.items ?? [])
      .filter((item) => item?.name)
      .map((item) => ({
        id: item.sys.id,
        name: item.name as string,
        slug: orgSlug(item.name, item.deptAbbreviation),
      }));
  } catch (error) {
    LogError("[departmentIndex]", error);
    return [];
  }
}

export async function facultyIndex(): Promise<OrgEntry[]> {
  try {
    const data = await requestTolerant<FacultyIndex>(GET_FACULTY_INDEX);
    return (data.facultyCollection.items ?? [])
      .filter((item) => item?.name)
      .map((item) => ({
        id: item.sys.id,
        name: item.name as string,
        slug: orgSlug(item.name),
      }));
  } catch (error) {
    LogError("[facultyIndex]", error);
    return [];
  }
}
