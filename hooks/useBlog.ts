import { useFetchData } from "./useFetchData";
import { getBlogPost, type BlogAsset, type BlogPost } from "@/lib/data/blog";

export type { BlogAsset, BlogPost };

export const useBlog = (slug: string, initialData?: BlogPost | null) => {
  return useFetchData({
    queryKey: ["blog", slug],
    queryFn: () => getBlogPost(slug),
    enabled: !!slug,
    initialData,
  });
};
