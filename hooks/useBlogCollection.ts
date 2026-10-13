'use client';
import { useFetchData } from "./useFetchData";
import { getBlogs, type Blog } from "@/lib/data/blog";

export type { Blog };

const useBlogCollection = (initialData?: Blog[]) => {
    return useFetchData({
        queryKey: ["blogs"],
        queryFn: getBlogs,
        initialData,
    })
}

export default useBlogCollection;
