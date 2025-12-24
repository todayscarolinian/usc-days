import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const STALE_TIME = 1000 * 60 * 5;

export const useSignOut = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axios.get("/api/user/logout");
            localStorage.removeItem("user");
            return response.data.status;
        },
        onError: (error) => {
            console.error("Error during logout", error);
        },
    });
};

export const useSignIn = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axios.get("/api/user/login");
            return response.data.url;
        },
        onSuccess: (url) => {
            window.location.href = url;
        },
        onError: (error) => {
            console.error("Error during login", error);
        },
    });
};

export const getUserId = (email: string | undefined) => {
    return useQuery({
        queryKey: ["user", email],
        queryFn: async () => {
            const response = await axios.get(`/api/user/services`, {
                params: { email },
            });
            return response.data.userId;
        },
        enabled: !!email,
        staleTime: STALE_TIME,
    });
};
