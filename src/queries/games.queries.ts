"use client";

import { AddGamePayload, EditGamePayload } from "@/src/types/games.types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Game } from "../lib/prisma/generated/client";
import axios from "axios";
import { Schedules } from "../types/types";
const STALE_TIME = 1000 * 60 * 5;

export const getGamesQuery = (params?: {
  startDate?: string;
  endDate?: string;
}) =>
  useQuery<Schedules[]>({
    queryKey: ["games", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const url = `/api/games${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await axios.get(url);
      return response.data.games;
    },
    staleTime: STALE_TIME,
  });

export const useAddGamesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Game, Error, AddGamePayload, { prevGames?: any[] }>({
    mutationFn: async (data) => {
      const response = await axios.post(`/api/games`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (err, g, context: any) => {
      if (context?.prevGames) {
        queryClient.setQueryData(["games"], context.prevGames);
      }
    },
  });
};

export const useEditGamesQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Game, Error, EditGamePayload>({
    mutationFn: async (gameData) => {
      const { id, ...rest } = gameData;
      const { data } = await axios.put("/api/games", { id, ...rest });
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

export const useDeleteGamesQuery = () => {
  const queryClient = useQueryClient();

  return useMutation<Game, Error, { scheduleId: number }>({
    mutationFn: async ({ scheduleId }) => {
      const { data } = await axios.delete(`/api/games`, {
        data: { id: scheduleId },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (error) => {
      console.error("Error deleting game:", error);
    },
  });
};
