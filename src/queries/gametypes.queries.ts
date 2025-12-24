import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

type GameType = {
    id: number;
    gameName: string;
};

const STALE_TIME = 1000 * 60 * 5;

export const getGameTypesQuery = () =>
    useQuery<GameType[]>({
        queryKey: ["sports"],
        queryFn: async () => {
            const response = await axios.get("/api/sports");
            return response.data.sports;
        },
        staleTime: STALE_TIME,
    });
