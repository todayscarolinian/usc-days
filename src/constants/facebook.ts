import {
  USC_DAYS_END_DATE,
  USC_DAYS_START_DATE,
} from "@/src/constants/event";

/** Public fetching settings. Credentials are read by the server-only service. */
export const FACEBOOK_GRAPH_CONFIG = {
  url: "https://graph.facebook.com/v26.0",
  postFields: "id,message,created_time,permalink_url,full_picture",
  revalidateSeconds: 10 * 60,
  cacheTag: "facebook-posts",
  pageSize: 100,
  // Bound how much Page history a single request can fetch.
  maxPages: 20,
  // Graph API "object does not exist / cannot be loaded" error code.
  notFoundCode: 100,
} as const;

export const FACEBOOK_QUERY_CONFIG = {
  endpoint: "/api/facebook-posts",
  queryKey: "facebook-posts",
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
} as const;

/** Homepage news is limited to the USC Days 2026 event dates, inclusive. */
export const FACEBOOK_NEWS_CONFIG = {
  hashtag: "USCDays2026",
  postLimit: 4,
  startDate: USC_DAYS_START_DATE,
  endDate: USC_DAYS_END_DATE,
  timeZone: "Asia/Manila",
  utcOffset: "+08:00",
} as const;
