import {
  USC_DAYS_END_DATE,
  USC_DAYS_START_DATE,
} from "@/src/constants/event";
import type {
  MatchdayGameStatus,
  TodaysGamesSelection,
} from "@/src/types/games.types";
import type { Schedules } from "@/src/types/types";
import { getGameStatus } from "@/src/lib/game-status";

const EVENT_CALENDAR = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function getEventDay(
  now: Date,
  startDate: string = USC_DAYS_START_DATE,
  endDate: string = USC_DAYS_END_DATE,
): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;

  const parts = EVENT_CALENDAR.formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  // Compare calendar dates at UTC midnight, not elapsed hours since opening.
  const today = Date.UTC(year, month - 1, day);
  const daysSinceStart = Math.floor((today - start) / 86_400_000);
  const lastEventDay = Math.floor((end - start) / 86_400_000) + 1;

  return Math.min(lastEventDay, Math.max(0, daysSinceStart + 1));
}

export function getMatchdayGameStatus(
  game: Schedules,
  now: Date,
): MatchdayGameStatus {
  const status = getGameStatus(game, now);
  if (status === "upcoming") return "UPCOMING";
  if (status === "live") return "ONGOING";
  return null;
}

export function selectTodaysGames(games: Schedules[], now: Date): TodaysGamesSelection {
  const sortedGames = games.filter((game) => {
    if (game.teamA == null || game.teamB == null) return false;
    const status = getGameStatus(game, now);
    return status === "live" || status === "upcoming";
  }).sort(
    (a, b) =>
      Number(getGameStatus(b, now) === "live") - Number(getGameStatus(a, now) === "live") ||
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime() ||
      a.id - b.id,
  );

  return {
    featured: sortedGames.slice(0, 1),
    compact: sortedGames.slice(1, 5),
  };
}
