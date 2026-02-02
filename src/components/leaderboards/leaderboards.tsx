"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DataTable } from "@/src/components/leaderboards/data-table";
import { columns } from "@/src/components/leaderboards/columns";
import { transformGamesToSchoolRank } from "@/src/components/leaderboards/transformData";
import { getGamesQuery } from "@/src/queries/games.queries";
import SportSelector from "@/src/components/ui/sport-selector";
import LeaderboardsTableSkeleton from "@/src/components/leaderboards/leaderboards-table-skeleton";

export default function Leaderboards() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSport = searchParams.get("sport")
    ? Number(searchParams.get("sport"))
    : null;

  const { data: games = [], error, isLoading: loading } = getGamesQuery();

  const transformed = useMemo(() => {
    return transformGamesToSchoolRank(games, selectedSport || undefined);
  }, [games, selectedSport]);

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
        <SportSelector
          value={selectedSport}
          onValueChangeAction={handleSportSelect}
          className="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] max-w-xs bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
        />
        {error || loading ? (
          <LeaderboardsTableSkeleton error={error?.message} />
        ) : (
          <DataTable columns={columns} data={transformed} title="USC DAYS" />
        )}
      </div>
    </div>
  );
}
