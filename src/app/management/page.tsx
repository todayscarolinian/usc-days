"use client";

import { useEffect, useState } from "react";
import { sportColumns, SportInfo } from "@/components/sports/columns";
import { SportsDataTable } from "@/components/sports/data-table";
import { teamColumns, TeamInfo } from "@/components/teams/columns";
import { TeamsDataTable } from "@/components/teams/data-table";
import axios from "axios";

type ExtractedData = {
    id: number;
    teamName: string;
    gameTypes: [
        {
            gameType: {
                id: number;
                gameName: string;
            };
        }
    ];
    teamSchools: [
        {
            school: {
                id: number;
                schoolName: string;
            };
        }
    ];
};

export default function Home() {
    const [teamsData, setTeamsData] = useState<TeamInfo[]>([]);
    const [sportsData, setSportsData] = useState<SportInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { teams: data },
                } = await axios.get("/api/teams");

                // Transform teams data
                const transformedTeamsData: TeamInfo[] = data.map(
                    (team: ExtractedData) => ({
                        id: team.id,
                        teamName: team.teamName,
                        schools: team.teamSchools.map((school) => ({
                            id: school.school.id,
                            schoolName: school.school.schoolName,
                        })),
                    })
                );

                const sportInfoMap = new Map<number, SportInfo>();

                // Process data to build sports data
                data.forEach((team: ExtractedData) => {
                    team.gameTypes.forEach((gameType) => {
                        const gameTypeId = gameType.gameType.id;
                        const gameTypeName = gameType.gameType.gameName;

                        // If sport exists in map, add team to list
                        if (sportInfoMap.has(gameTypeId)) {
                            sportInfoMap.get(gameTypeId)?.teams.push({
                                id: team.id,
                                name: team.teamName,
                            });
                        } else {
                            // else, make new SportInfo entry
                            sportInfoMap.set(gameTypeId, {
                                id: gameTypeId,
                                name: gameTypeName,
                                teams: [
                                    {
                                        id: team.id,
                                        name: team.teamName,
                                    },
                                ],
                            });
                        }
                    });
                });

                // Convert map to array
                const transformedSportsData: SportInfo[] = Array.from(
                    sportInfoMap.values()
                );

                // Update state
                setTeamsData(transformedTeamsData);
                setSportsData(transformedSportsData);
            } catch (err) {
                console.error("Error fetching data:", err);
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
                <div className="grid lg:grid-cols-7 gap-6">
                    <div className="lg:col-span-3">
                        <TeamsDataTable
                            columns={teamColumns}
                            data={teamsData}
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <SportsDataTable
                            columns={sportColumns}
                            data={sportsData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
