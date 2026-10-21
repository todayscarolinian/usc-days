"use client";

import { AddGamePayload, EditGamePayload, MultiTeamResultPayload, ScoreDeltaPayload } from "@/src/types/games.types";
import { useMemo } from "react";
import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchGamesPage } from "@/src/services/games.client";
import { addScheduleDays, getScheduleLoadedRange } from "@/src/lib/schedules";
import { Game } from "../lib/prisma/generated/client";
import axios from "axios";
import { Schedules } from "../types/types";
const STALE_TIME = 1000 * 60 * 5;

export const useGamesQuery = (params?: {
  startDate?: string;
  endDate?: string;
}, options?: { refetchInterval?: number; enabled?: boolean }) =>
  useQuery<Schedules[]>({
    queryKey: ["games", params],
    queryFn: async ({ signal }) => {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const url = `/api/games${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await axios.get(url, { signal });
      return response.data.data;
    },
    staleTime: STALE_TIME,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
  });

export const useAddGamesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Game, Error, AddGamePayload, { prevGames?: Schedules[] }>({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/games`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (err, g, context) => {
      if (context?.prevGames) {
        queryClient.setQueryData(["games"], context.prevGames);
      }
    },
  });
};

export const useEditGamesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Game, Error, EditGamePayload & { id: number }>({
    mutationFn: async ({ id, ...body }) => {
      const { data } = await axios.put(`/api/games/${id}`, body);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },

    onError: (error) => {
      console.error("Error editing game: ", error);
    },
  });
};

export const useSaveResultsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Schedules, Error, MultiTeamResultPayload & { id: number }>({
    mutationFn: async ({ id, ...body }) => {
      const { data } = await axios.put(`/api/games/${id}/results`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const gameQueryKey = (id: number) => ["games", "detail", id] as const;

export const useGameQuery = (id: number) =>
  useQuery<Schedules>({
    queryKey: gameQueryKey(id),
    queryFn: async ({ signal }) => {
      const { data } = await axios.get(`/api/games/${id}`, { signal });
      return data;
    },
  });

/**
 * Applies a score change to a cached game the way the server does: empty scores start at 0.
 * Scores arrive as JSON strings of Prisma decimals, so the result is stored the same way.
 */
function applyScoreDelta(game: Schedules, { team, delta }: ScoreDeltaPayload): Schedules {
  const field = team === "A" ? "teamAScore" : "teamBScore";
  const score = (value: unknown) => String(Number(value ?? 0)) as unknown as Schedules["teamAScore"];
  return {
    ...game,
    teamAScore: score(game.teamAScore),
    teamBScore: score(game.teamBScore),
    [field]: score(Number(game[field] ?? 0) + delta),
  };
}

export const scoreMutationKey = (id: number) => ["games", "score", id] as const;

/**
 * Optimistic: the cached score changes immediately and taps can overlap, since the server
 * applies each delta atomically. Once the last change settles, the game is refetched so
 * responses arriving out of order cannot leave a stale score on screen.
 */
export const useUpdateScoreQuery = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<Game, Error, ScoreDeltaPayload>({
    mutationKey: scoreMutationKey(id),
    mutationFn: async (body) => {
      const { data } = await axios.patch(`/api/games/${id}/score`, body);
      return data;
    },
    onMutate: async (change) => {
      await queryClient.cancelQueries({ queryKey: gameQueryKey(id) });
      queryClient.setQueryData<Schedules>(gameQueryKey(id), (current) =>
        current && applyScoreDelta(current, change),
      );
    },
    onError: (_error, change) => {
      queryClient.setQueryData<Schedules>(gameQueryKey(id), (current) =>
        current && applyScoreDelta(current, { ...change, delta: -change.delta }),
      );
    },
    onSettled: () => {
      // This mutation still counts as in flight while its callbacks run.
      if (queryClient.isMutating({ mutationKey: scoreMutationKey(id) }) > 1) return;
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
};

export const useDeleteGamesQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { scheduleId: number }>({
    mutationFn: async ({ scheduleId }) => {
      await axios.delete(`/api/games/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (error) => {
      console.error("Error deleting game:", error);
    },
  });
};

const SCHEDULE_PAGE_SIZE = 5;

/**
 * Games around `anchor`: every game starting that day, plus pages of
 * `SCHEDULE_PAGE_SIZE` games before and after it, in chronological order.
 * `gameTypeIds` is `undefined` while it can't be resolved yet (the queries
 * wait), `null` for no sport filter, and `[]` when no sport matches.
 */
export function useScheduleWindow({
  anchor,
  gameTypeIds,
  teamId,
}: {
  anchor: string | null;
  gameTypeIds: number[] | null | undefined;
  teamId: number | null;
}) {
  const filters = { gameTypeIds: gameTypeIds ?? undefined, teamId };
  const enabled = anchor !== null && gameTypeIds !== undefined && gameTypeIds?.length !== 0;
  const nextDay = anchor ? addScheduleDays(anchor, 1) : undefined;
  const key = { anchor, gameTypeIds, teamId };

  const day = useQuery({
    queryKey: ["games", "schedule", "day", key],
    queryFn: ({ signal }) =>
      fetchGamesPage({ ...filters, startsFrom: anchor ?? undefined, startsBefore: nextDay }, signal),
    enabled,
    staleTime: STALE_TIME,
    refetchInterval: 60_000,
  });

  const past = useInfiniteQuery({
    queryKey: ["games", "schedule", "past", key],
    queryFn: ({ pageParam, signal }) =>
      fetchGamesPage({
        ...filters,
        startsBefore: anchor ?? undefined,
        order: "desc",
        limit: SCHEDULE_PAGE_SIZE,
        cursor: pageParam,
      }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
    enabled,
    staleTime: STALE_TIME,
  });

  const future = useInfiniteQuery({
    queryKey: ["games", "schedule", "future", key],
    queryFn: ({ pageParam, signal }) =>
      fetchGamesPage({
        ...filters,
        startsFrom: nextDay,
        order: "asc",
        limit: SCHEDULE_PAGE_SIZE,
        cursor: pageParam,
      }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
    enabled,
    staleTime: STALE_TIME,
  });

  const pastGames = useMemo(
    () => (past.data?.pages.flatMap(page => page.data) ?? []).reverse(),
    [past.data],
  );
  const futureGames = useMemo(
    () => future.data?.pages.flatMap(page => page.data) ?? [],
    [future.data],
  );
  const games = useMemo(
    () => [...pastGames, ...(day.data?.data ?? []), ...futureGames],
    [pastGames, day.data, futureGames],
  );

  const hasOlder = past.hasNextPage;
  const hasNewer = future.hasNextPage;
  const loadedRange = useMemo(
    () => anchor ? getScheduleLoadedRange(anchor, pastGames[0], futureGames.at(-1), hasOlder, hasNewer) : null,
    [anchor, pastGames, futureGames, hasOlder, hasNewer],
  );

  return {
    games,
    // A filter matching no sports is settled with nothing to show.
    isPending: enabled ? day.isPending || past.isPending || future.isPending : gameTypeIds === undefined || anchor === null,
    isError: day.isError || past.isError || future.isError,
    isFetching: day.isFetching || past.isFetching || future.isFetching,
    refetch: () => Promise.all([day.refetch(), past.refetch(), future.refetch()]),
    pastPageCount: past.data?.pages.length ?? 0,
    hasOlder,
    hasNewer,
    isLoadingOlder: past.isFetchingNextPage,
    isLoadingNewer: future.isFetchingNextPage,
    loadOlder: () => past.fetchNextPage(),
    loadNewer: () => future.fetchNextPage(),
    loadedRange,
  };
}
