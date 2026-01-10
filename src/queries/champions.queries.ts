"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Champions } from "@/src/types/types";
import { AddChampionPayload, DeleteChampionPayload, EditChampionPayload } from "../types/champions.types";

const STALE_TIME = 1000 * 60 * 5;

export const getChampionsQuery = () =>
    useQuery<Champions[]>({
        queryKey: ["champions"],
        queryFn: async () => {
            const response = await axios.get("/api/champions");
            return response.data.champions;
        },
        staleTime: STALE_TIME,
    });

export const useAddChampionsQuery = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, AddChampionPayload>({
        mutationFn: async (data) => {
            const response = await axios.post(`/api/champions`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["champions"] });
        },
        onError: (err, c, context: any) => {
            if (context?.prevChampions) {
                queryClient.setQueryData(["champions"], context.prevChampions);
            }
        },
    });
};

export const useEditChampionsQuery = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, EditChampionPayload>({
        mutationFn: async (data) => {
            const response = await axios.put(`/api/champions`, data);
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
    return useMutation<any, Error, DeleteChampionPayload>({
        mutationFn: async ({ id }) => {
            const { data } = await axios.delete(`/api/champions`, {
                data: { id }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["champions"] });
        },
        onError: (error) => {
            console.error("Error deleting champion: ", error);
        }
    });
};
