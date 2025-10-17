"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/leaderboards/data-table";
import { columns, SchoolRank } from "@/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/components/leaderboards/transformData";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SportSelector from "@/components/leaderboards/sport-selector";
import LeaderboardsTableSkeleton from "@/components/leaderboards/leaderboards-table-skeleton";

export default function RankingsPage() {
    const STALE_TIME = 1000 * 60 * 5;
    const [rankingsData, setRankingsData] = useState<SchoolRank[]>([]);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    const fetchGamesData = async () => {
        const response = await axios.get("/api/games");
        return response.data.games;
    };

    const {
        data: games = [],
        error,
        isLoading: loading,
    } = useQuery({
        queryKey: ["games"],
        queryFn: fetchGamesData,
        staleTime: STALE_TIME,
    });

    useEffect(() => {
        if (!selectedSport) {
            setRankingsData([]);
            return;
        }

        const transformed = transformGamesToSchoolRank(games, selectedSport);
        setRankingsData(transformed);
    }, [selectedSport]);

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <SportSelector
                    selected={selectedSport}
                    onSelect={setSelectedSport}
                />
                {error || loading ? (
                    <LeaderboardsTableSkeleton error={error?.message} />
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
