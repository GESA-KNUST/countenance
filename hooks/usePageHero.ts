'use client';
import { useFetchData } from "./useFetchData";
import {
  PAGE_HERO_FALLBACKS,
  fetchPageHero,
  type PageHero,
  type PageHeroKey,
} from "@/lib/data/page-hero";

export const usePageHero = (pageKey: PageHeroKey): { hero: PageHero; isLoading: boolean } => {
  const { data, isLoading } = useFetchData<PageHero>({
    queryKey: ["page-hero", pageKey],
    queryFn: () => fetchPageHero(pageKey),
    placeholderData: PAGE_HERO_FALLBACKS[pageKey],
  });

  return { hero: data ?? PAGE_HERO_FALLBACKS[pageKey], isLoading };
};
