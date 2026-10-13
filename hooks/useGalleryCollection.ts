'use client';
import { useFetchData } from "./useFetchData";
import { getGalleries, getGalleryGroup, type Gallery } from "@/lib/data/gallery";

export type { Gallery };

export const useGalleries = (initialData?: Gallery[]) => {
  const { data, isLoading, error } = useFetchData({
    queryKey: ["galleries"],
    queryFn: getGalleries,
    initialData,
  });

  return { data, isLoading, error };
};

export const useGalleryCollection = (galleryGroupId: string) => {
  const { data, isLoading, error } = useFetchData({
    queryKey: ["gallery", galleryGroupId],
    queryFn: () => getGalleryGroup(galleryGroupId),
    enabled: !!galleryGroupId,
  });

  return { data, isLoading, error };
};
