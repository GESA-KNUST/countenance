import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENTFUL_CACHE_TAG } from "../contentful-client";

const PATHS_BY_TYPE: Record<string, string[]> = {
  blogPost: ["/", "/blog", "/blog-2"],
  eventCard: ["/", "/events"],
  personalityOfTheWeek: ["/"],
  galleryGroup: ["/", "/gallery"],
  galleryImage: ["/gallery"],
  hub: ["/", "/hubs"],
  announcements: ["/hubs"],
  executive: ["/executives"],
  club: ["/", "/clubs"],
  department: ["/department", "/departments"],
  faculty: ["/faculty", "/faculties"],
  blogAuthor: ["/blog", "/blog-2"],
  blogTaglist: ["/blog", "/blog-2"],
  generalSiteContent: ["/"],
};

/**
 * Only the pages that actually show this content are rebuilt. Refreshing the
 * whole site made every section on every page cold again after one small edit.
 */
export function refreshSite(type?: string, extraPaths: string[] = []) {
  revalidateTag(CONTENTFUL_CACHE_TAG, "seconds");

  const paths = new Set([...(type ? PATHS_BY_TYPE[type] ?? [] : []), ...extraPaths]);

  if (paths.size === 0) {
    revalidatePath("/", "layout");
    return;
  }

  for (const path of paths) revalidatePath(path);
}
