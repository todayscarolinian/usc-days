import {
  USC_DAYS_END_DATE,
  USC_DAYS_START_DATE,
} from "@/src/constants/event";
import type {
  MatchdayGameStatus,
  TodaysGamesSelection,
} from "@/src/types/games.types";
import type { Schedules } from "@/src/types/types";

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
  const hasResult =
    game.winnerId != null ||
    game.isDraw ||
    game.teamAForfeited ||
    game.teamBForfeited ||
    (game.teamAScore != null && game.teamBScore != null);

  // Recorded results and elapsed schedules are neither upcoming nor ongoing.
  if (hasResult) return null;
  if (new Date(game.startDate) > now) return "UPCOMING";
  if (new Date(game.endDate) > now) return "ONGOING";
  return null;
}

export function selectTodaysGames(games: Schedules[]): TodaysGamesSelection {
  const sortedGames = [...games].sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime() ||
      a.id - b.id,
  );

  return {
    featured: sortedGames.slice(0, 3),
    compact: sortedGames.slice(3, 7),
  };
}
