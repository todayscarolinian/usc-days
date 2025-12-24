import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

type Team = {
    id: number;
    teamName: string;
};

const STALE_TIME = 1000 * 60 * 5;

export const getTeamGameTypesQuery = (sport: Number) =>
    useQuery<Team[]>({
        queryKey: ["teamgametypes", sport],
        queryFn: async () => {
            const response = await axios.get(
                `/api/teamgametypes?sportId=${sport}`
            );
            return response.data.teams;
        },
        enabled: !!sport,
        staleTime: STALE_TIME,
    });
