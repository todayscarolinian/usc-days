import { z } from "zod";
import {
  endOfDayQuery,
  limitQuery,
  startOfDayQuery,
} from "@/src/lib/api/query-params";

/** Raw post as returned by the Graph API. */
export interface GraphPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  full_picture?: string;
}

/** Paginated Graph API list response. */
export interface GraphList<T> {
  data: T[];
  paging?: { next?: string };
}

/**
 * Post shape exposed by our API. `imageUrl` points at fbcdn and expires,
 * so it must be fetched fresh rather than persisted.
 */
export interface FacebookPost {
  id: string;
  message: string | null;
  createdTime: string;
  permalinkUrl: string;
  imageUrl: string | null;
}

export interface GetFacebookPostsParams {
  since: Date;
  until: Date;
  limit?: number;
}

const MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export const FacebookPostsQuerySchema = z
  .object({
    hashtag: z
      .string({ error: "hashtag is required." })
      .trim()
      .transform((v) => v.replace(/^#/, ""))
      .pipe(
        z
          .string()
          .regex(
            /^[A-Za-z0-9_]{1,100}$/,
            "hashtag may only contain letters, numbers, and underscores.",
          ),
      ),
    startDate: startOfDayQuery,
    endDate: endOfDayQuery,
    limit: limitQuery(100),
  })
  .superRefine((query, ctx) => {
    if (!query.startDate) {
      ctx.addIssue({ code: "custom", path: ["startDate"], message: "startDate is required." });
    }
    if (!query.endDate) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "endDate is required." });
    }
    if (!query.startDate || !query.endDate) return;

    if (query.endDate < query.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "endDate must be on or after startDate.",
      });
    } else if (query.endDate.getTime() - query.startDate.getTime() > MAX_RANGE_DAYS * DAY_MS) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: `Date range cannot exceed ${MAX_RANGE_DAYS} days.`,
      });
    }
  });

/** Page post ids look like `{page_id}_{post_id}`. */
export const FacebookPostIdSchema = z
  .string()
  .regex(/^\d+_\d+$/, "Invalid Facebook post id.");
