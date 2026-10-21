import type { Schedules } from "@/src/types/types";

export type GameStatus = "upcoming" | "live" | "finished" | "awaiting";

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  finished: "Finished",
  awaiting: "Awaiting result",
};

/**
 * Only a winner, draw, or forfeit finishes a game; scores alone are a running tally.
 * An elapsed schedule without a result is awaiting its result.
 * A multi-team game finishes once any team is ranked.
 */
export function getGameStatus(game: Schedules, now: Date): GameStatus {
  const multiTeam = game.gameType.format === "MULTI_TEAM";
  const hasResult = multiTeam
    ? game.participants.some((p) => p.rank != null)
    : game.winnerId != null ||
      game.isDraw ||
      game.teamAForfeited ||
      game.teamBForfeited;

  if (hasResult) return "finished";
  if (new Date(game.startDate) > now) return "upcoming";
  if (new Date(game.endDate) > now) return "live";
  return "awaiting";
}
