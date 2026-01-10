"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/src/components/schedules/schedules-list"; // cards view
import { getGamesQuery } from "@/src/queries/games.queries";
import { Schedules } from "@/src/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleFilter from "./schedule-filter";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import SchedulesListSkeleton from "./schedules-list-skeleton";

export default function SchedulesPage() {
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    useInitializeUserStore();
    const { email } = useUserStore();

    const {
        data: fetchedGamesData = [],
        error,
        isLoading: loading,
    } = getGamesQuery();

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
        <ScheduleFilter onSelect={setSelectedSport} selected={selectedSport} />
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
