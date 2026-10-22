import { getGameStatus } from "@/src/lib/game-status";
import { groupSwimmingMatches, type ScheduleDay, type ScheduleFilters } from "@/src/lib/schedules";
import type { Schedules } from "@/src/types/types";

export type ScheduleAutoScrollRequest =
  | { id: number; source: "full-schedule" }
  | { id: number; source: "event-filter"; event: string | null };

type ScheduleAutoScrollRequestInput =
  | { source: "full-schedule" }
  | { source: "event-filter"; event: string | null };
type ScheduleAutoScrollListener = (request: ScheduleAutoScrollRequest) => void;

let nextRequestId = 0;
let pendingRequest: ScheduleAutoScrollRequest | null = null;
const listeners = new Set<ScheduleAutoScrollListener>();

function publish(request: ScheduleAutoScrollRequestInput) {
  const id = ++nextRequestId;
  pendingRequest = request.source === "full-schedule"
    ? { id, source: "full-schedule" }
    : { id, source: "event-filter", event: request.event };
  for (const listener of listeners) listener(pendingRequest);
}

/** Request a one-shot jump after navigating to the unfiltered schedule. */
export function requestFullScheduleAutoScroll() {
  publish({ source: "full-schedule" });
}

/** Request a one-shot jump within the event filter that was just selected. */
export function requestEventScheduleAutoScroll(event: string | null) {
  publish({ source: "event-filter", event });
}

export function getPendingScheduleAutoScrollRequest() {
  return pendingRequest;
}

export function subscribeToScheduleAutoScrollRequests(listener: ScheduleAutoScrollListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function completeScheduleAutoScrollRequest(id: number) {
  if (pendingRequest?.id === id) pendingRequest = null;
}

/** Wait until navigation/filter URL state matches the scope requested by the click. */
export function isScheduleAutoScrollScopeReady(
  request: ScheduleAutoScrollRequest,
  filters: ScheduleFilters,
  matchId: string | null,
) {
  if (matchId) return false;
  if (request.source === "full-schedule") {
    return !filters.event && !filters.sportId && !filters.teamId && !filters.date;
  }
  return filters.event === request.event && !filters.sportId && !filters.date;
}

/**
 * Choose within rendered order: the first live match, otherwise the earliest
 * strictly future match. Swimming can be grouped by event before rendering.
 * Finished and elapsed matches are not targets.
 */
export function selectScheduleAutoScrollTarget(
  days: readonly ScheduleDay[],
  now: Date,
  categorizeSwimming = false,
): Schedules | null {
  let upcoming: Schedules | null = null;
  let upcomingTime = Number.POSITIVE_INFINITY;

  for (const day of days) {
    const displayedGames = categorizeSwimming
      ? groupSwimmingMatches(day.games).flatMap(category => category.games)
      : day.games;
    for (const game of displayedGames) {
      if (getGameStatus(game, now) === "live") return game;
      const startTime = new Date(game.startDate).getTime();
      if (startTime > now.getTime() && startTime < upcomingTime) {
        upcoming = game;
        upcomingTime = startTime;
      }
    }
  }

  return upcoming;
}
