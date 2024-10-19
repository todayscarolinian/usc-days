"use client";

import { useEffect, useState } from "react";
import { scoreColumns } from "@/components/scores/columns";
import { DataTable } from "@/components/scores/score-table";
import AddScoreDialog from "@/components/scores/add-score-dialog";
import { Schedules, Scores } from "@/types/types";
import axios from "axios";

export default function ScoresPage() {
    const [gamesData, setGamesData] = useState<Scores[]>([]);
    const [schedulesData, setSchedulesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { games: data },
                } = await axios.get(`/api/games`);

                const now = new Date();

                // Filter games data
                const filteredGamesData = data.filter((game: Scores) => game.score !== null);
                const filteredSchedulesData = data.filter((game: Scores) => {
                    const startDate = new Date(game.startDate);
                    const isFuture = now.getTime() - startDate.getTime() <= 0;
                    return !isFuture && game.score === null; // games that are not yet ongoing and don't have a score
                });

                setGamesData(filteredGamesData);
                setSchedulesData(filteredSchedulesData);
            } catch (err) {
                console.error("Error fetching scores data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto sm:max-w-[90rem]">
                <DataTable
                    columns={scoreColumns}
                    data={gamesData}
                    actionButton={<AddScoreDialog schedules={schedulesData} />}
                />
            </div>
        </div>
    );
}
