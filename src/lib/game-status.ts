import type { Schedules } from "@/src/types/types";

export type GameStatus = "upcoming" | "live" | "finished" | "awaiting" | "ended";

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  finished: "Finished",
  awaiting: "Awaiting result",
  ended: "Finished",
};

/**
 * Only a winner, draw, or forfeit finishes a game; scores alone are a running tally.
 * An elapsed schedule with scores but no result is awaiting its result.
 */
export function getGameStatus(game: Schedules, now: Date): GameStatus {
  const hasResult =
    game.winnerId != null ||
    game.isDraw ||
    game.teamAForfeited ||
    game.teamBForfeited;
  const hasScores = game.teamAScore != null || game.teamBScore != null;

  if (hasResult) return "finished";
  if (new Date(game.startDate) > now) return "upcoming";
  if (new Date(game.endDate) > now) return "live";
  return hasScores ? "awaiting" : "ended";
}
