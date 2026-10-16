import { z } from "zod";
import { getEventDayRange } from "@/src/lib/time";

/**
 * Zod building blocks for query-string schemas used with `parseQuery`.
 * Every helper is optional: an absent param yields `undefined`, an invalid one yields a 400.
 *
 *   const GamesQuery = z.object({
 *     teamId: idQuery,
 *     hasWinner: boolQuery,
 *     startDate: startOfDayQuery,
 *     endDate: endOfDayQuery,
 *     limit: limitQuery(),
 *   });
 */

/** Positive integer id, e.g. `?teamId=4`. */
export const idQuery = z.coerce.number().int().positive().optional();

/** Comma-separated positive integer ids, e.g. `?gameTypeIds=1,2,3`. */
export const idListQuery = z
  .string()
  .transform((v) => v.split(",").map((part) => part.trim()))
  .pipe(z.array(z.coerce.number<string>().int().positive()).min(1))
  .optional();

/** Any finite number, e.g. `?minPrice=99.5`. */
export const numberQuery = z.coerce.number().optional();

/** `true` / `false` (also accepts `1`/`0`, `yes`/`no`). */
export const boolQuery = z.stringbool().optional();

/** Non-empty trimmed string. */
export const stringQuery = z.string().trim().min(1).optional();

// Dates are `YYYY-MM-DD` event days in the event timezone (Asia/Manila), not
// server-local time. Range filters use start-of-day / end-of-day so an
// `endDate` is inclusive of the whole day.
const isoDate = z.iso.date();

export const startOfDayQuery = isoDate.transform((v) => getEventDayRange(v).start).optional();
export const endOfDayQuery = isoDate.transform((v) => getEventDayRange(v).end).optional();

/** Page size, clamped to `max` so large values degrade instead of failing. */
export function limitQuery(max = 100) {
  return z.coerce
    .number()
    .int()
    .positive()
    .transform((n) => Math.min(n, max))
    .optional();
}
