"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface FetchOptions<T> extends Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn"> {
  queryKey: string | any[];
  queryFn: () => Promise<T>;
}

export function useFetchData<T>({ queryKey, queryFn }: FetchOptions<T>) {
  return useQuery<T, Error>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        console.error('[useFetchData Error]', error);
        throw error;
      }
    },
  });
}
