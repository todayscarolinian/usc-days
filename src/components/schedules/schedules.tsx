"use client";

import { useEffect, useState } from "react";
import { scheduleColumns } from "@/components/schedules/columns";
// import { DataTable } from "@/components/schedules/schedules-table";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import { mockGames } from "@/lib/mockGames"; // mock data

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

                setGamesData(fetchedGamesData);
            } catch (err) {
                // console.error("Error fetching games data:", err);
                // setError("Failed to load games data");
                console.error("Error fetching mock games data, using mock:", err);
                setGamesData(mockGames);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchGamesData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                    <AddScheduleDialog />
                </div>
                <SchedulesList games={gamesData} />
            </div>
            {/* <div className="mx-auto sm:max-w-360">
                <DataTable
                    columns={scheduleColumns}
                    data={gamesData}
                    actionButton={<AddScheduleDialog />}
                />
            </div> */}
        </div>
    );
}
