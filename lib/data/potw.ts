import { requestTolerant } from "../contentful-client";
import { GET_POTW, type POTWItem } from "@/hooks/usePOTW";
import { LogError } from "../logger";

export function personalitySlug(item: POTWItem) {
  if (item.slug) return item.slug;
  const name = (item.name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return name || item.sys.id;
}

export async function getPersonalityBySlug(slug: string): Promise<POTWItem | null> {
  const items = await getPersonalityOfTheWeek();
  return items?.find((item) => personalitySlug(item) === slug) ?? null;
}

export async function getPersonalityOfTheWeek(): Promise<POTWItem[] | null> {
  try {
    const data = await requestTolerant<{
      personalityOfTheWeekCollection: { items: POTWItem[] };
    }>(GET_POTW);

    const items = data.personalityOfTheWeekCollection?.items ?? [];
    return items.length > 0 ? items : null;
  } catch (error) {
    LogError("[getPersonalityOfTheWeek]", error);
    return null;
  }
}
