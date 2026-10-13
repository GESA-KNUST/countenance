import { useFetchData } from "./useFetchData";
import { getClubs, type ClubItems } from "@/lib/data/club";

export type { ClubItems };

export const useClubs = (initialData?: ClubItems[]) => {
  return useFetchData({
    queryKey: ["clubs"],
    queryFn: getClubs,
    initialData,
  });
};
