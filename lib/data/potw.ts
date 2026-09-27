import { requestTolerant } from "../contentful-client";
import { GET_POTW, type POTWItem } from "@/hooks/usePOTW";
import { LogError } from "../logger";

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
