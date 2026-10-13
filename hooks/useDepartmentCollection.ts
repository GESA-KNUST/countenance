import { useFetchData } from "./useFetchData";
import { getDepartments, type DepartmentSummary } from "@/lib/data/department";

export type { DepartmentSummary };

export const useDepartmentCollection = (initialData?: DepartmentSummary[]) => {
    return useFetchData({
        queryKey: ["departments"],
        queryFn: getDepartments,
        initialData,
    });
};
