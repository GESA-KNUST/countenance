"use client";

import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { LogError } from "@/lib/logger";

interface FetchOptions<T>
  extends Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> {
  queryKey: string | readonly unknown[];
  queryFn: () => Promise<T>;
}

/**
 * Thin wrapper around React Query that normalizes the query key, centralizes
 * error logging, and forwards any remaining query options (e.g. `enabled`).
 */
export function useFetchData<T>({
  queryKey,
  queryFn,
  ...options
}: FetchOptions<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    ...options,
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        LogError("[useFetchData]", queryKey, error);
        throw error;
      }
    },
  });
}
