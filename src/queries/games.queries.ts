"use client";

import { AddGamePayload, EditGamePayload } from "@/src/types/games.types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Game } from "../lib/prisma/generated/client";
import axios from "axios";
import { Schedules } from "../types/types";
const STALE_TIME = 1000 * 60 * 5;

export const useGamesQuery = (params?: {
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
      return response.data.data;
    },
    staleTime: STALE_TIME,
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
