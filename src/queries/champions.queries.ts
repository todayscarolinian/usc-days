import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Champions } from "@/types/types";

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

export const addChampionsQuery = () => {
    const queryClient = useQueryClient();
    return useMutation<any>({
        mutationFn: async (data) => {
            const response = await axios.post(`/api/champions`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["champions"] });
        },
        onMutate: async (c) => {
            await queryClient.cancelQueries({ queryKey: ["champions"] });
            const prevChampions = queryClient.getQueryData<Champions[]>([
                "champions",
            ]);
            if (prevChampions) {
                queryClient.setQueryData(["champions"], [...prevChampions, c]);
            }

            return { prevChampions };
        },
        onError: (err, c, context: any) => {
            if (context?.prevChampions) {
                queryClient.setQueryData(["champions"], context.prevChampions);
            }
        },
    });
};
