import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Team, TeamGameType } from "../lib/prisma/generated/client";

type TeamType = TeamGameType & {
    team: Team;
}

const STALE_TIME = 1000 * 60 * 5;

export const getTeamGameTypesQuery = (sportId: number) =>
    useQuery<TeamType[]>({
        queryKey: ["teamgametypes", sportId],
        queryFn: async () => {
            const response = await axios.get(
                `/api/sports/${sportId}/teams`
            );
            return response.data.data;
        },
        enabled: sportId > 0,
        staleTime: STALE_TIME,
    });
