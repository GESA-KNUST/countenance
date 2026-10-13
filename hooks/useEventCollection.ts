import { useFetchData } from "./useFetchData";
import {
  getEvents,
  getEventBySlug,
  type EventItem,
  type EventImage,
  type EventVenue,
} from "@/lib/data/event";

export type { EventItem, EventImage, EventVenue };

const useEventCollection = (initialData?: EventItem[]) => {
  return useFetchData({
    queryKey: ["events"],
    queryFn: getEvents,
    initialData,
  });
};

export const useEventBySlug = (slug: string, initialData?: EventItem) => {
  return useFetchData({
    queryKey: ["event", slug],
    queryFn: async () => (await getEventBySlug(slug)) ?? undefined,
    enabled: !!slug,
    initialData,
  });
};

export default useEventCollection;
