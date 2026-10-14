import type {
  MatchdayGameStatus,
  TodaysGamesSelection,
} from "@/src/types/games.types";
import type { Schedules } from "@/src/types/types";

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
