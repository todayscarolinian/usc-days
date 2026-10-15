"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Champions } from "@/src/types/types";
import {
  AddChampionPayload,
  DeleteChampionPayload,
  EditChampionPayload,
} from "../types/champions.types";

const STALE_TIME = 1000 * 60 * 5;

export const useChampionsQuery = () =>
  useQuery<Champions[]>({
    queryKey: ["champions"],
    queryFn: async () => {
      const response = await axios.get<{ data: Champions[] }>("/api/champions");
      return response.data.data;
    },
    staleTime: STALE_TIME,
  });

export const useAddChampionsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Champions, Error, AddChampionPayload>({
    mutationFn: async ({ gameTypeId, teamId, startDate, endDate, rank }) => {
      // Explicit fields so the dialog's placeholder `id: -1` is never sent.
      const response = await axios.post<Champions>("/api/champions", {
        gameTypeId,
        teamId,
        startDate,
        endDate,
        rank,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["champions"] });
    },
  });
};

export const useEditChampionsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<Champions, Error, EditChampionPayload>({
    mutationFn: async ({ id, ...body }) => {
      const response = await axios.put<Champions>(`/api/champions/${id}`, body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["champions"] });
    },
    onError: (error) => {
      console.error("Error editing champion: ", error);
    },
  });
};

export const useDeleteChampionsQuery = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, DeleteChampionPayload>({
    mutationFn: async ({ id }) => {
      await axios.delete(`/api/champions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["champions"] });
    },
    onError: (error) => {
      console.error("Error deleting champion: ", error);
    },
  });
};