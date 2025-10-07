"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import SchedulesListSkeleton from "./schedules-list-skeleton";

export default function SchedulesPage() {
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGamesData = async () => {
            try {
                const {
                    data: { games: fetchedGamesData },
                } = await axios.get("/api/games");

                console.log("Fetched games data:", fetchedGamesData);

                setGamesData(fetchedGamesData);
            } catch (err) {
                console.error("Error fetching games data:", err);
                setError("Failed to load games data");
            } finally {
                setLoading(false);
            }
        };

        fetchGamesData();
    }, []);

    return (
        <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                    <AddScheduleDialog />
                </div>
                {loading || error ? (
                    <SchedulesListSkeleton
                        days={1}
                        rowsPerDay={2}
                        error={error}
                    />
                ) : (
                    <SchedulesList games={gamesData} />
                )}
            </div>
        </div>
    );
}
