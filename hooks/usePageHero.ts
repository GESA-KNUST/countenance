'use client';
import { useFetchData } from "./useFetchData";
import {
  PAGE_HERO_FALLBACKS,
  fetchPageHero,
  type PageHero,
  type PageHeroKey,
} from "@/lib/data/page-hero";


export const usePageHero = (
  pageKey: PageHeroKey,
  initial?: PageHero
): { hero: PageHero; isLoading: boolean } => {
  const { data, isLoading, isError } = useFetchData<PageHero>({
    queryKey: ["page-hero", pageKey],
    queryFn: () => fetchPageHero(pageKey),
    initialData: initial,
  });

  if (data) return { hero: data, isLoading: false };
  if (isError) return { hero: PAGE_HERO_FALLBACKS[pageKey], isLoading: false };

  return {
    hero: { ...PAGE_HERO_FALLBACKS[pageKey], images: [], mobileImages: [] },
    isLoading,
  };
};
