import { useFetchData } from "./useFetchData";
import { getFaculties, type FacultySummary } from "@/lib/data/faculty";

export type { FacultySummary };

export const useFacultyCollection = (initialData?: FacultySummary[]) => {
  return useFetchData<FacultySummary[]>({
    queryKey: ["faculties"],
    queryFn: getFaculties,
    initialData,
  });
};
