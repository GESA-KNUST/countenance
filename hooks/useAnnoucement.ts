import { useFetchData } from "./useFetchData";
import { getAnnouncements, type Announcement } from "@/lib/data/hub";

export type { Announcement };

export const useAnnouncements = (initialData?: Announcement[] | null) => {
  return useFetchData({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    initialData,
  });
};
