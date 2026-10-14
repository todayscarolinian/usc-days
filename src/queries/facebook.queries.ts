"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FACEBOOK_QUERY_CONFIG } from "@/src/constants/facebook";
import type { FacebookPost } from "@/src/types/facebook.types";

/** Collection response returned by GET /api/facebook-posts. */
interface FacebookPostsResponse {
  data: FacebookPost[];
}

/**
 * Queries Page posts for a hashtag (with or without `#`) within an inclusive
 * YYYY-MM-DD date range, optionally limited to a maximum number of posts.
 * Each parameter combination has its own cache entry. Cache timing and refetch
 * behavior are configured in src/constants/facebook.ts.
 */
export function useFacebookPostsQuery(
  hashtag: string,
  startDate: string,
  endDate: string,
  limit?: number,
) {
  return useQuery<FacebookPost[], Error>({
    queryKey: [FACEBOOK_QUERY_CONFIG.queryKey, hashtag, startDate, endDate, limit],

    // Forward React Query's abort signal so cancelled queries stop their request.
    queryFn: async ({ signal }) => {
      try {
        const response = await axios.get<FacebookPostsResponse>(
          FACEBOOK_QUERY_CONFIG.endpoint,
          {
            params: { hashtag, startDate, endDate, limit },
            signal,
          },
        );

        return response.data.data;
      } catch (error) {
        // Axios rejects HTTP errors automatically; preserve the API's message.
        if (axios.isAxiosError<{ error?: unknown }>(error) && error.response) {
          const message = error.response.data?.error;
          throw new Error(
            typeof message === "string" ? message : "Could not fetch Facebook posts.",
          );
        }

        // Preserve cancellation and network errors for React Query.
        throw error;
      }
    },

    staleTime: FACEBOOK_QUERY_CONFIG.staleTime,
    gcTime: FACEBOOK_QUERY_CONFIG.gcTime,
    refetchOnWindowFocus: FACEBOOK_QUERY_CONFIG.refetchOnWindowFocus,
  });
}
