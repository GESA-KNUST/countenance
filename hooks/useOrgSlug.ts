import { useFetchData } from "./useFetchData";
import { departmentIndex, facultyIndex, type OrgEntry } from "@/lib/data/org-index";

function useOrgId(kind: "department" | "faculty", slug: string) {
  const { data, isLoading, error } = useFetchData<OrgEntry[]>({
    queryKey: [`${kind}-index`],
    queryFn: () => (kind === "department" ? departmentIndex() : facultyIndex()),
  });

  const match = (data ?? []).find((item) => item.slug === slug);

  return { id: match?.id ?? "", isLoading, error, known: (data ?? []).length > 0 };
}

export const useDepartmentIdFromSlug = (slug: string) => useOrgId("department", slug);
export const useFacultyIdFromSlug = (slug: string) => useOrgId("faculty", slug);
