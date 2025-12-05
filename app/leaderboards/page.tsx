"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/src/components/leaderboards/data-table";
import { columns } from "@/src/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/src/components/leaderboards/transformData";
import axios from "axios";
import SportSelector from "@/src/components/ui/sport-selector";
import LeaderboardsTableSkeleton from "@/src/components/leaderboards/leaderboards-table-skeleton";
import { StandingData } from "@/src/types/types";

export default function RankingsPage() {
  const [rankingsData, setRankingsData] = useState<StandingData[]>([]);
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
        } = await axios.get(`/api/games?gameTypeId=${selectedSport}`);
        const transformed = transformGamesToSchoolRank(games);
        setRankingsData(transformed);
      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError("Error fetching rankings");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedSport]);

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto max-w-[96%] space-y-6">
        <SportSelector
          selected={selectedSport}
          onSelect={setSelectedSport}
          triggerClassName="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] min-w-full bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
        />
        {/* if error or (loading and selectedSport is not null), show skeleton. if loading and selectedSport is null, show nothing. if not loading, and selectedsport is not null and no errors, show datatable */}
        {error || (loading && selectedSport) ? (
          <LeaderboardsTableSkeleton error={error} />
        ) : null}

        {!error && !loading && selectedSport != null && (
          <DataTable columns={columns} data={rankingsData} title="USC DAYS" />
        )}
      </div>
    </div>
  );
}
