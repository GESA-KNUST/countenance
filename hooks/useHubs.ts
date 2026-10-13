import { useFetchData } from "./useFetchData";
import { getHubs, type HubItem } from "@/lib/data/hub";

export type { HubItem };
export type hubItem = HubItem;

export const useHubs = (initialData?: HubItem[] | null) => {
  return useFetchData({
    queryKey: ["hubs"],
    queryFn: getHubs,
    initialData,
  });
};
