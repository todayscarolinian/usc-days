"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/leaderboards/data-table";
import { columns, SchoolRank } from "@/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/components/leaderboards/transformData";
import axios from "axios";
import SportSelector from "@/components/leaderboards/sport-selector";
import LeaderboardsTableSkeleton from "@/components/leaderboards/leaderboards-table-skeleton";

export default function RankingsPage() {
    const [rankingsData, setRankingsData] = useState<SchoolRank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    useEffect(() => {
        if (!selectedSport) {
            setRankingsData([]);
            setLoading(false);
            return;
        }
        const fetchRankings = async () => {
            try {
                setLoading(true);
                setError(null);

                const {
                    data: { games },
                } = await axios.get("/api/games");
                const transformed = transformGamesToSchoolRank(
                    games,
                    selectedSport
                );
                setRankingsData(transformed);
            } catch (err) {
                console.error("Error fetching rankings:", err);
                setError("Error fetching rankings");
                setError("Error fetching rankings");
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [selectedSport]);

    if (error) {
        return <div className="p-4 text-red-500">Error Fetching Data</div>;
    }

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <SportSelector
                    selected={selectedSport}
                    onSelect={setSelectedSport}
                />
                {loading ? (
                    <LeaderboardsTableSkeleton />
                ) : (
                    <DataTable
                        columns={columns}
                        data={rankingsData}
                        title="USC DAYS"
                    />
                )}
            </div>
        </div>
    );
}

