"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import DayNavigation from "./day-navigation";
import { useInitializeUserStore, useUserStore } from "@/stores/user-store";
import SchedulesListSkeleton from "./schedules-list-skeleton";

export default function SchedulesPage() {
    const STALE_TIME = 1000 * 60 * 5;
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    useInitializeUserStore();
    const { email } = useUserStore();

    const fetchGamesData = async () => {
        const response = await axios.get("/api/games");
        return response.data.games;
    };

    const {
        data: fetchedGamesData = [],
        error,
        isLoading: loading,
    } = useQuery({
        queryKey: ["games"],
        queryFn: fetchGamesData,
        staleTime: STALE_TIME,
    });

    useEffect(() => {
        if (!fetchedGamesData || fetchedGamesData.length === 0) return;

        if (!selectedSport || selectedSport === 0) {
            setGamesData(fetchedGamesData);
            return;
        }

        let filteredData = fetchedGamesData;
        if (selectedSport && selectedSport !== 0) {
            filteredData = fetchedGamesData.filter(
                (game: Schedules) => game.gameType.id === selectedSport
            );
        }
        setGamesData(filteredData);
    }, [selectedSport, fetchedGamesData]);

    return (
        <>
            <DayNavigation
                onSelect={setSelectedSport}
                selected={selectedSport}
            />
            <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
                <div className="flex flex-col gap-4">
                    {email && (
                        <div className="flex justify-end">
                            <AddScheduleDialog />
                        </div>
                    )}
                    {loading || error ? (
                        <SchedulesListSkeleton
                            days={1}
                            rowsPerDay={2}
                            error={error?.message}
                        />
                    ) : (
                        <SchedulesList games={gamesData} />
                    )}
                </div>
            </div>
        </>
    );
}
