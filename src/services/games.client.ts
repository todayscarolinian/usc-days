import axios from "axios";
import { Schedules, filterType } from "@/src/types/types";

export async function fetchGamesPage(
  cursor?: string | null,
  limit = 20,
  filters?: filterType,
  signal?: AbortSignal
): Promise<{
  games: Schedules[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  const params = new URLSearchParams();
  
  if (cursor) params.append("cursor", cursor);
  params.append("limit", String(limit));
  
  // Apply filters
  if (filters?.date) params.append("startDate", filters.date);
  if (filters?.game) params.append("gameTypeId", filters.game);

  if (filters?.teams?.home && filters?.teams?.away) {
    if (filters.teams.home === filters.teams.away) {
      params.append("teamId", filters.teams.home);
    } else {
      params.append("teamAId", filters.teams.home);
      params.append("teamBId", filters.teams.away);
    }
  } else if (filters?.teams?.home) {
    params.append("teamAId", filters.teams.home);
  } else if (filters?.teams?.away) {
    params.append("teamBId", filters.teams.away);
  }

  if (filters?.finishedGames !== undefined) {
    params.append("hasWinner", String(filters.finishedGames));
  }

  const { data } = await axios.get(`/api/games?${params.toString()}`, {
    signal
  });

  if (Array.isArray(data.games) && !data.nextCursor) {
    return {
      games: data.games,
      nextCursor: null,
      hasMore: false,
    };
  }

  return data;
}