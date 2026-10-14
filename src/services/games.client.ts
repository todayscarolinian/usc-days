import axios from "axios";
import { filterType } from "@/src/types/types";
import { PaginatedGamesResponse } from "@/src/types/games.types";

export async function fetchGamesPage(
  cursor?: string | null,
  limit = 20,
  filters?: filterType,
  signal?: AbortSignal
): Promise<PaginatedGamesResponse> {
  const params = new URLSearchParams();
  
  if (cursor) params.append("cursor", cursor);
  params.append("limit", String(limit));
  
  // Apply filters
  if (filters?.date) params.append("startDate", filters.date);
  if (filters?.game) params.append("gameTypeId", filters.game);

  const teamId = filters?.teams?.home ?? filters?.teams?.away;
  if (teamId) {
    params.append("teamId", teamId);
  }

  if (filters?.finishedGames !== undefined) {
    params.append("hasWinner", String(filters.finishedGames));
  }

  const { data } = await axios.get<PaginatedGamesResponse>(`/api/games?${params.toString()}`, {
    signal
  });

  return data;
}