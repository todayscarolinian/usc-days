import axios from "axios";
import { PaginatedGamesResponse } from "@/src/types/games.types";

export type GamesPageParams = {
  gameTypeIds?: readonly number[];
  teamId?: number | null;
  /** `YYYY-MM-DD` Manila day; games starting on or after it. */
  startsFrom?: string;
  /** `YYYY-MM-DD` Manila day; games starting before it. */
  startsBefore?: string;
  order?: "asc" | "desc";
  limit?: number;
  cursor?: string | null;
};

export async function fetchGamesPage(
  params: GamesPageParams,
  signal?: AbortSignal,
): Promise<PaginatedGamesResponse> {
  const query = new URLSearchParams();

  if (params.gameTypeIds?.length) query.append("gameTypeIds", params.gameTypeIds.join(","));
  if (params.teamId) query.append("teamId", String(params.teamId));
  if (params.startsFrom) query.append("startsFrom", params.startsFrom);
  if (params.startsBefore) query.append("startsBefore", params.startsBefore);
  if (params.order) query.append("order", params.order);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.cursor) query.append("cursor", params.cursor);

  const { data } = await axios.get<PaginatedGamesResponse>(`/api/games?${query.toString()}`, {
    signal,
  });

  return data;
}
