import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const STALE_TIME = 1000 * 60 * 5;

export const useResolveUserId = () => {
    return useQuery({
        queryKey: ["user-id"],
        queryFn: async () => {
            const response = await axios.get("/api/user/id");
            return response.data.userId;
        },
        staleTime: STALE_TIME,
    });
};
