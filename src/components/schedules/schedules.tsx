"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import { games } from "@/constants/mockData"; // mock data
import DayNavigation from "./day-navigation";

export default function SchedulesPage() {
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                const {
                    data: { games: fetchedGamesData },
                } = await axios.get("/api/games");

                let filteredData = fetchedGamesData;

                if (selectedSport && selectedSport !== 0) {
                    filteredData = fetchedGamesData.filter(
                        (game: Schedules) => game.gameType.id === selectedSport
                    );
                }

                setGamesData(filteredData);
            } catch (err) {
                console.error("Error fetching games data:", err);
                setError("Failed to load games data");
            } finally {
                setLoading(false);
            }
        };

        fetchGamesData();
    }, [selectedSport]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <DayNavigation
                onSelect={setSelectedSport}
                selected={selectedSport}
            />
            <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <AddScheduleDialog />
                    </div>
                    <SchedulesList games={gamesData} />
                </div>
            </div>
        </>
    );
}
