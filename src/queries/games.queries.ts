"use client";

import { AddGamePayload, EditGamePayload } from "@/types/games.types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
const STALE_TIME = 1000 * 60 * 5;

export const getGamesQuery = () =>
    useQuery<any>({
        queryKey: ["games"],
        queryFn: async () => {
            const response = await axios.get("/api/games");
            return response.data.games;
        },
        staleTime: STALE_TIME,
    });

export const useAddGamesQuery = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, AddGamePayload, { prevGames?: any[] }>({
        mutationFn: async (data) => {
            const response = await axios.post(`/api/games`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },
        onMutate: async (g) => {
            await queryClient.cancelQueries({ queryKey: ["games"] });
            const prevGames = queryClient.getQueryData<any[]>(["games"]);
            if (prevGames) {
                queryClient.setQueryData(["games"], [...prevGames, g]);
            }

            return { prevGames };
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
    return useMutation<any, Error, EditGamePayload>({
        mutationFn: async (gameData) => {
            const { id, ...rest } = gameData;
            const { data } = await axios.put("/api/games", { id, ...rest });
            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["games"] });
        },

        onError: (error) => {
            console.error("Error editing game.");
        },
    });
};

export const useDeleteGamesQuery = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { scheduleId: number }>({
        mutationFn: async ({ scheduleId }) => {
            const { data } = await axios.delete(`/api/games`, {
                data: { scheduleId },
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
