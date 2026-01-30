//TO-DO: add logos and missing icons (contemporary dance and fallback icon)

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Button } from "@/src/components/ui/button";
import { Champion, GameType, Team } from "@/src/lib/prisma/generated/client";
import { transformGamesToSchoolRank } from "../leaderboards/transformData";
import { Champions, StandingData } from "@/src/types/types";
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

  // Static data (fetched once using TanStack Query)
  const { data: gameTypes = [], error: gameTypesError } = getGameTypesQuery();
  const { data: teams = [], error: teamsError } = getTeamsQuery();

  // Dynamic data (changes per sport selection)
  const [championsData, setChampionsData] = useState<Champions[]>([]);
  const [standingsData, setStandingsData] = useState<StandingWithRank[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditChampionPayload | null>(null);

  useInitializeUserStore();
  const { email } = useUserStore();
  const isAdmin = !!email;

  // Fetch dynamic data using TanStack Query
  const { data: championsQueryData = [], error: championsError } =
    getChampionsQuery();
  const { data: gamesQueryData = [], error: gamesError } = getGamesQuery();

  // Process data when sport selection or query data changes
  const fetchStandingsData = useCallback(() => {
    if (!selectedSport) {
      setStandingsData([]);
      setChampionsData([]);
      return;
    }

    if (gameTypesError || teamsError || championsError || gamesError) {
      toast.error("Failed to load standings data");
      return;
    }

    try {
      setLoading(true);

      // Filter data by selected sport
      const champions: Champions[] = championsQueryData.filter(
        (c: any) => c.gameType.id === selectedSport,
      );
      const games = gamesQueryData.filter(
        (g: any) => g.gameType?.id === selectedSport,
      );

      setChampionsData(champions);

      // Transform games to standings statistics
      const gameStandings = transformGamesToSchoolRank(games, selectedSport);

      // Create comprehensive standings list
      const allStandings: StandingWithRank[] = [];

      // Add teams with game statistics
      gameStandings.forEach((standing) => {
        const champion = champions.find(
          (c) => c.team.teamName === standing.team,
        );
        allStandings.push({
          ...standing,
          rank: champion?.rank || 0,
        });
      });

      // Add champions without game history
      champions.forEach((champion) => {
        const existingStanding = allStandings.find(
          (s) => s.team === champion.team.teamName,
        );

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

      setStandingsData(allStandings);
    } catch (err) {
      console.error("Error processing standings data:", err);
      toast.error("Failed to process standings data");
      setStandingsData([]);
      setChampionsData([]);
    } finally {
      setLoading(false);
    }
  }, [
    selectedSport,
    championsQueryData,
    gamesQueryData,
    gameTypesError,
    teamsError,
    championsError,
    gamesError,
  ]);

  useEffect(() => {
    fetchStandingsData();
  }, [fetchStandingsData]);

  // Memoized computed values
  const sportName = useMemo(
    () =>
      gameTypes.find((sport: GameType) => sport.id === selectedSport)
        ?.gameName || "",
    [gameTypes, selectedSport],
  );

  const topThreeCards = useMemo(() => {
    const cards: CardData[] = [1, 2, 3].map((rank) => {
      const champion = championsData.find((c) => c.rank === rank);

      if (champion) {
        const standing = standingsData.find(
          (s) => s.team === champion.team.teamName,
        );

        if (standing) {
          return {
            ...standing,
            rank: champion.rank,
          };
        }

        // Champion exists but no game history
        return {
          id: champion.team.id,
          team: champion.team.teamName,
          wins: 0,
          losses: 0,
          winPercentage: 0,
          sport: sportName,
          rank: champion.rank,
        };
      }

      // No champion for this rank - TBD
      return {
        id: 0,
        team: "TBD",
        wins: 0,
        losses: 0,
        winPercentage: 0,
        sport: sportName,
        rank,
      };
    });

    return cards;
  }, [championsData, standingsData, sportName]);

  // Handler functions
  const handleCardClick = useCallback(
    (rank: number) => {
      if (!isAdmin) return;
      const champion = championsData.find((c) => c.rank === rank);

      setFormData({
        id: champion?.id || -1,
        gameTypeId: selectedSport!,
        rank,
        teamId: champion?.team.id || -1,
        endDate: champion?.endDate
          ? new Date(champion.endDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        startDate: champion?.startDate
          ? new Date(champion.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setShowDialog(true);
    },
    [championsData, selectedSport],
  );

  const handleAddStanding = useCallback(() => {
    if (!selectedSport) return;

    setFormData({
      id: -1,
      gameTypeId: selectedSport,
      rank: 1, // Default to first place
      teamId: -1,
      endDate: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
    });
    setShowDialog(true);
  }, [selectedSport]);

  const handleCloseDialog = useCallback(
    (dataChanged?: boolean) => {
      setFormData(null);
      setShowDialog(false);
      // Only refetch data if changes were made
      if (dataChanged) {
        fetchStandingsData();
      }
    },
    [fetchStandingsData],
  );

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
        <div className="flex justify-between items-center">
          <SportSelector
            value={selectedSport}
            onValueChangeAction={handleSportSelect}
            className="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] max-w-xs bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
          />
          {isAdmin && (
            <Button
              variant="default"
              disabled={!selectedSport}
              onClick={handleAddStanding}
            >
              + Add Standing
            </Button>
          )}
        </div>

        {loading && selectedSport && (
          <>
            <StandingsCardsSkeleton />
            <StandingsTableSkeleton rows={6} />
          </>
        )}

        {selectedSport && !loading && (
          <>
            {/* Top 3 Champion Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              {topThreeCards.map((card, index) => (
                <Cards
                  key={`rank-${index + 1}`}
                  data={card}
                  onSelect={() => handleCardClick(index + 1)}
                />
              ))}
            </div>

            {/* Full Standings Table */}
            <DataTable columns={standingColumns} data={standingsData} />
          </>
        )}
      </div>

      {/* Form Dialog */}
      {formData && (
        <StandingFormDialog
          open={showDialog}
          mode={formData.id === -1 ? "add" : "edit"}
          initialData={formData}
          teams={teams}
          onCloseAction={handleCloseDialog}
        />
      )}
    </div>
  );
}
