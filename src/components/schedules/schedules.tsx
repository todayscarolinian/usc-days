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
                console.error(
                    "Error fetching mock games data, using mock:",
                    err
                );
                const schedulesMock: Schedules[] = games.map((g) => ({
                    id: g.id,
                    startDate: g.startDate,
                    endDate: g.endDate,
                    gameType: {
                        id: g.gameTypeId,
                        gameName: "Mock Sport", // TODO: look up from mock gameTypes
                    },
                    teamA: {
                        id: g.teamAId,
                        teamName: "Mock Team A", // TODO: look up from mock teams
                    },
                    teamB: {
                        id: g.teamBId,
                        teamName: "Mock Team B", // TODO: look up from mock teams
                    },
                    score:
                        g.teamAScore !== null && g.teamBScore !== null
                            ? {
                                  teamAScore: g.teamAScore,
                                  teamBScore: g.teamBScore,
                              }
                            : null,
                    location: g.location ?? undefined,
                }));

                setGamesData(schedulesMock);
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
        <>
            <DayNavigation />
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
