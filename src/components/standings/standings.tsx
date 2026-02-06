"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getChampionsQuery } from "@/src/queries/champions.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getGamesQuery } from "@/src/queries/games.queries";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import SportSelector from "@/src/components/ui/sport-selector";
import Cards from "@/src/components/standings/standings-cards";
import StandingsCardsSkeleton from "@/src/components/standings/standings-cards-skeleton";
import DataTable from "@/src/components/standings/standings-table";
import StandingsTableSkeleton from "@/src/components/standings/standings-table-skeleton";
import standingColumns from "@/src/components/standings/columns";
// Removed Button import
import { GameType } from "@/src/lib/prisma/generated/client";
import { transformGamesToSchoolRank } from "../leaderboards/transformData";
import { Champions, Schedules, StandingData } from "@/src/types/types";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import { EditChampionPayload } from "@/src/types/champions.types";
import StandingFormDialog from "./standing-dialog-form";
import { toast } from "sonner";

export type StandingWithRank = StandingData & {
  rank: number;
};

type CardData = {
  id: number;
  team: string;
  wins: number;
  losses: number;
  winPercentage: number;
  sport: string;
  rank: number;
};

export default function Standings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedSport = searchParams.get("sport")
    ? Number(searchParams.get("sport"))
    : null;

  const {
    data: gameTypes = [],
    error: gameTypesError,
    isLoading: gameTypesLoading,
  } = getGameTypesQuery();
  const {
    data: teams = [],
    error: teamsError,
    isLoading: teamsLoading,
  } = getTeamsQuery();

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditChampionPayload | null>(null);

  const shownLoadErrorRef = useRef(false);
  const shownProcessErrorRef = useRef(false);

  useInitializeUserStore();
  const { email } = useUserStore();
  const isAdmin = !!email;

  const {
    data: championsQueryData = [],
    error: championsError,
    isLoading: championsLoading,
  } = getChampionsQuery();
  const {
    data: gamesQueryData = [],
    error: gamesError,
    isLoading: gamesLoading,
  } = getGamesQuery();

  useEffect(() => {
    const hasError = gameTypesError || teamsError || championsError || gamesError;
    if (hasError && !shownLoadErrorRef.current) {
      toast.error("Failed to load standings data");
      shownLoadErrorRef.current = true;
    } else if (!hasError) {
      shownLoadErrorRef.current = false;
    }
  }, [gameTypesError, teamsError, championsError, gamesError]);

  const loading = gameTypesLoading || teamsLoading || championsLoading || gamesLoading;

  const championsData = useMemo(() => {
    if (!selectedSport) return [];
    return championsQueryData.filter((c: Champions) => c.gameType.id === selectedSport);
  }, [selectedSport, championsQueryData]);

  const { data: standingsData, error: standingsError } = useMemo(() => {
    if (!selectedSport) return { data: [], error: false };

    try {
      const filteredChampions = championsQueryData.filter(
        (c: Champions) => c.gameType.id === selectedSport,
      );
      const games = gamesQueryData.filter(
        (g: Schedules) => g.gameType?.id === selectedSport,
      );

      const gameStandings = transformGamesToSchoolRank(games, selectedSport);
      const allStandings: StandingWithRank[] = [];

      gameStandings.forEach((standing) => {
        const champion = filteredChampions.find((c) => c.team.teamName === standing.team);
        allStandings.push({ ...standing, rank: champion?.rank || 0 });
      });

      filteredChampions.forEach((champion) => {
        const existingStanding = allStandings.find((s) => s.team === champion.team.teamName);
        if (!existingStanding) {
          allStandings.push({
            id: champion.team.id,
            team: champion.team.teamName,
            wins: 0,
            losses: 0,
            winPercentage: 0,
            sport: champion.gameType.gameName,
            rank: champion.rank,
          });
        }
      });

      return { data: allStandings, error: false };
    } catch (err) {
      console.error("Error processing standings data:", err);
      return { data: [], error: true };
    }
  }, [selectedSport, gamesQueryData, championsQueryData]);

  useEffect(() => {
    if (standingsError && !shownProcessErrorRef.current) {
      toast.error("Failed to process standings data");
      shownProcessErrorRef.current = true;
    } else if (!standingsError) {
      shownProcessErrorRef.current = false;
    }
  }, [standingsError]);

  const sportName = useMemo(
    () => gameTypes.find((sport: GameType) => sport.id === selectedSport)?.gameName || "",
    [gameTypes, selectedSport],
  );

  const topThreeCards = useMemo(() => {
    return [1, 2, 3].map((rank) => {
      const champion = championsData.find((c) => c.rank === rank);
      if (champion) {
        const standing = standingsData.find((s) => s.team === champion.team.teamName);
        return standing ? { ...standing, rank: champion.rank } : {
          id: champion.team.id,
          team: champion.team.teamName,
          wins: 0,
          losses: 0,
          winPercentage: 0,
          sport: sportName,
          rank: champion.rank,
        };
      }
      return { id: 0, team: "TBD", wins: 0, losses: 0, winPercentage: 0, sport: sportName, rank };
    });
  }, [championsData, standingsData, sportName]);

  const handleCardClick = useCallback(
    (rank: number) => {
      const champion = championsData.find((c) => c.rank === rank);
      
      // Only allow editing if the champion already exists
      if (!champion) return;

      setFormData({
        id: champion.id,
        gameTypeId: selectedSport!,
        rank,
        teamId: champion.team.id,
        endDate: new Date(champion.endDate).toISOString().split("T")[0],
        startDate: new Date(champion.startDate).toISOString().split("T")[0],
      });
      setShowDialog(true);
    },
    [championsData, selectedSport],
  );

  // handleAddStanding function removed

  const handleCloseDialog = useCallback(() => {
    setFormData(null);
    setShowDialog(false);
  }, []);

  const handleSportSelect = (sportId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    sportId ? params.set("sport", sportId.toString()) : params.delete("sport");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto max-w-[96%] space-y-6">
        <div className="flex justify-between items-center">
          <SportSelector
            value={selectedSport}
            onValueChangeAction={handleSportSelect}
            className="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] max-w-xs bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
          />
          {/* Add Standing Button fully removed */}
        </div>

        {loading && selectedSport && (
          <>
            <StandingsCardsSkeleton />
            <StandingsTableSkeleton rows={6} />
          </>
        )}

        {selectedSport && !loading && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              {topThreeCards.map((card, index) => (
                <Cards
                  key={`rank-${index + 1}`}
                  data={card}
                  onSelect={() => isAdmin ? handleCardClick(index + 1) : undefined}
                />
              ))}
            </div>
            <DataTable columns={standingColumns} data={standingsData} />
          </>
        )}
      </div>

      {formData && (
        <StandingFormDialog
          open={showDialog}
          mode="edit" // Only "edit" mode is now accessible
          initialData={formData}
          teams={teams}
          onCloseAction={handleCloseDialog}
        />
      )}
    </div>
  );
}