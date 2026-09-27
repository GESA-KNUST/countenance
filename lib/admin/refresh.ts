import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENTFUL_CACHE_TAG } from "../contentful-client";

export function refreshSite() {
  revalidateTag(CONTENTFUL_CACHE_TAG, "seconds");
  revalidatePath("/", "layout");
}
