import { z } from "zod";

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

/** Any finite number, e.g. `?minPrice=99.5`. */
export const numberQuery = z.coerce.number().optional();

/** `true` / `false` (also accepts `1`/`0`, `yes`/`no`). */
export const boolQuery = z.stringbool().optional();

/** Non-empty trimmed string. */
export const stringQuery = z.string().trim().min(1).optional();

// Dates are `YYYY-MM-DD` interpreted in server-local time, matching the
// existing games filter. Range filters use start-of-day / end-of-day so an
// `endDate` is inclusive of the whole day.
const isoDate = z.iso.date();

function localDate(value: string, endOfDay: boolean) {
  const [year, month, day] = value.split("-").map(Number);
  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
}

export const startOfDayQuery = isoDate.transform((v) => localDate(v, false)).optional();
export const endOfDayQuery = isoDate.transform((v) => localDate(v, true)).optional();

/** Page size, clamped to `max` so large values degrade instead of failing. */
export function limitQuery(max = 100) {
  return z.coerce
    .number()
    .int()
    .positive()
    .transform((n) => Math.min(n, max))
    .optional();
}
