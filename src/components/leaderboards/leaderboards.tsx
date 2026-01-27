"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DataTable } from "@/src/components/leaderboards/data-table";
import { columns } from "@/src/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/src/components/leaderboards/transformData";
import { getGamesQuery } from "@/src/queries/games.queries";
import SportSelector from "@/src/components/leaderboards/sport-selector";
import LeaderboardsTableSkeleton from "@/src/components/leaderboards/leaderboards-table-skeleton";
import { StandingData } from "@/src/types/types";

export default function Leaderboards() {
  const [rankingsData, setRankingsData] = useState<StandingData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSport = searchParams.get("sport")
    ? Number(searchParams.get("sport"))
    : null;

  const { data: games = [], error, isLoading: loading } = getGamesQuery();

  useEffect(() => {
    if (!selectedSport) {
      setRankingsData([]);
      return;
    }

    const transformed = transformGamesToSchoolRank(games, selectedSport);
    setRankingsData(transformed);
  }, [selectedSport]);

  const handleSportSelect = (sportId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sportId) {
      params.set("sport", sportId.toString());
    } else {
      params.delete("sport");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto max-w-[96%] space-y-6">
        <SportSelector selected={selectedSport} onSelect={handleSportSelect} />
        {error || loading ? (
          <LeaderboardsTableSkeleton error={error?.message} />
        ) : (
          <DataTable columns={columns} data={rankingsData} title="USC DAYS" />
        )}
      </div>
    </div>
  );
}
