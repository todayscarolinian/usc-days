import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Team, TeamGameType } from "../lib/prisma/generated/client";

type TeamType = TeamGameType & {
    team: Team;
}

const STALE_TIME = 1000 * 60 * 5;

export const getTeamGameTypesQuery = (sport: Number) =>
    useQuery<TeamType[]>({
        queryKey: ["teamgametypes", sport],
        queryFn: async () => {
            const response = await axios.get(
                `/api/teamgametypes?sportId=${sport}`
            );
            console.table("Fetched team game types:", response.data.teams);
            return response.data.teams;
        },
        enabled: !!sport,
        staleTime: STALE_TIME,
    });
