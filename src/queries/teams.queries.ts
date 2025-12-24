import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

type Team = {
    id: number;
    teamName: string;
};

const STALE_TIME = 1000 * 60 * 5;

export const getTeamsQuery = () =>
    useQuery<Team[]>({
        queryKey: ["teams"],
        queryFn: async () => {
            const response = await axios.get("/api/teams");
            return response.data.teams;
        },
        staleTime: STALE_TIME,
    });

export const addTeamsQuery = () => {
    const queryClient = useQueryClient();
    return useMutation<any>({
        mutationFn: async (data) => {
            const response = await axios.post(`/api/teams`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onMutate: async (t) => {
            await queryClient.cancelQueries({ queryKey: ["teams"] });
            const prevTeams = queryClient.getQueryData<any[]>(["teams"]);
            if (prevTeams) {
                queryClient.setQueryData(["teams"], [...prevTeams, t]);
            }

            return { prevTeams };
        },
        onError: (err, t, context: any) => {
            if (context?.prevTeams) {
                queryClient.setQueryData(["teams"], context.prevTeams);
            }
        },
    });
};
