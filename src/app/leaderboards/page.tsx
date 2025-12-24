"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/leaderboards/data-table";
import { columns, SchoolRank } from "@/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/components/leaderboards/transformData";
import { getGamesQuery } from "@/queries/games.queries";
import SportSelector from "@/components/leaderboards/sport-selector";
import LeaderboardsTableSkeleton from "@/components/leaderboards/leaderboards-table-skeleton";

export default function RankingsPage() {
    const [rankingsData, setRankingsData] = useState<SchoolRank[]>([]);
    const [selectedSport, setSelectedSport] = useState<number | null>(null);

    const { data: games = [], error, isLoading: loading } = getGamesQuery();

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
