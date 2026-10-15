import type { Schedules } from "@/src/types/types";

export type GameStatus = "upcoming" | "live" | "finished" | "ended";

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  finished: "Final",
  ended: "Ended",
};

/** An elapsed schedule without a recorded result is not a finished result. */
export function getGameStatus(game: Schedules, now: Date): GameStatus {
  const hasResult =
    game.winnerId != null ||
    game.isDraw ||
    game.teamAForfeited ||
    game.teamBForfeited ||
    (game.teamAScore != null && game.teamBScore != null);

  if (hasResult) return "finished";
  if (new Date(game.startDate) > now) return "upcoming";
  if (new Date(game.endDate) > now) return "live";
  return "ended";
}
