"use client";

import { useQuery } from "@tanstack/react-query";
import type { FacebookPost } from "@/src/types/facebook.types";

/** Collection response returned by GET /api/facebook-posts. */
interface FacebookPostsResponse {
  data: FacebookPost[];
}

/**
 * Queries Page posts for a hashtag (with or without `#`) within an inclusive
 * YYYY-MM-DD date range, optionally limited to a maximum number of posts.
 * Each parameter combination has its own cache entry, fresh for one hour.
 * Inactive entries are retained for one hour; window focus does not refetch.
 */
export function useFacebookPostsQuery(
  hashtag: string,
  startDate: string,
  endDate: string,
  limit?: number,
) {
  return useQuery<FacebookPost[], Error>({
    queryKey: ["facebook-posts", hashtag, startDate, endDate, limit],

    // Forward React Query's abort signal so cancelled queries stop their fetch.
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        hashtag,
        startDate,
        endDate,
      });

      if (limit !== undefined) {
        params.set("limit", String(limit));
      }

      const response = await fetch(`/api/facebook-posts?${params.toString()}`, {
        signal,
      });

      // Fetch does not throw on HTTP errors; reject them for React Query.
      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(
          typeof body?.error === "string"
            ? body.error
            : "Could not fetch Facebook posts.",
        );
      }

      const body: FacebookPostsResponse = await response.json();
      return body.data;
    },

    staleTime: 1000 * 60 * 60, // Reuse fresh data on subsequent mounts.
    gcTime: 1000 * 60 * 60, // Retain cached data after the last subscriber unmounts.
    refetchOnWindowFocus: false,
  });
}
