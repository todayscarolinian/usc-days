"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useChampionsQuery } from "@/src/queries/champions.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { useGamesQuery } from "@/src/queries/games.queries";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";

import SportSelector from "@/src/components/ui/sport-selector";
import StandingsTable from "./standings-table";
import StandingsTableSkeleton from "./standings-table-skeleton";
import TournamentPlacings from "./tournament-placings";
import StandingFormDialog from "./standing-dialog-form";
import { transformEntryStandings, transformTeamsData } from "./transformTeamsData";

import type { Champions } from "@/src/types/types";
import type { EditChampionPayload } from "@/src/types/champions.types";

export default function Standings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const sportParameter = searchParams.get("sport");
  const parsedSport = sportParameter ? Number(sportParameter) : null;
  const selectedSport =
    parsedSport && Number.isFinite(parsedSport) ? parsedSport : null;

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] =
    useState<EditChampionPayload | null>(null);

  const shownError = useRef(false);
  const { hasAccess: isAdmin } = useHasHeraldDomainAccess();

  const {
    data: gameTypes = [],
    error: gameTypesError,
    isLoading: gameTypesLoading,
  } = getGameTypesQuery();

  const {
    data: teams = [],
    error: teamsError,
  } = getTeamsQuery();

  const {
    data: champions = [],
    error: championsError,
    isLoading: championsLoading,
  } = useChampionsQuery();

  const {
    data: games = [],
    error: gamesError,
    isLoading: gamesLoading,
  } = useGamesQuery();

  useEffect(() => {
    if (gameTypesLoading || gameTypes.length === 0) return;

    const selectedSportExists = gameTypes.some(
      (sport) => sport.id === selectedSport,
    );

    if (selectedSportExists) return;

    const params = new URLSearchParams(queryString);
    params.set("sport", gameTypes[0].id.toString());

    router.replace(`/standings?${params.toString()}`, {
      scroll: false,
    });
  }, [
    gameTypes,
    gameTypesLoading,
    queryString,
    router,
    selectedSport,
  ]);

  useEffect(() => {
    const error =
      gameTypesError ||
      teamsError ||
      championsError ||
      gamesError;

    if (error && !shownError.current) {
      toast.error("Failed to load standings data");
      shownError.current = true;
    }

    if (!error) {
      shownError.current = false;
    }
  }, [
    gameTypesError,
    teamsError,
    championsError,
    gamesError,
  ]);

  const sportName =
    gameTypes.find((sport) => sport.id === selectedSport)?.gameName ||
    "";

  const selectedFormat = gameTypes.find((sport) => sport.id === selectedSport)?.format;
  const standingsData = !selectedSport
    ? []
    : selectedFormat === "MULTI_TEAM"
      ? transformEntryStandings(games, selectedSport)
      : transformTeamsData(games, selectedSport);

  const championsData = selectedSport
    ? champions.filter(
        (champion: Champions) =>
          champion.gameType.id === selectedSport,
      )
    : [];

  const loading =
    gameTypesLoading || championsLoading || gamesLoading;

  function handleSportSelect(sportId: number | null) {
    if (!sportId) return;

    const params = new URLSearchParams(queryString);
    params.set("sport", sportId.toString());

    router.push(`/standings?${params.toString()}`, {
      scroll: false,
    });
  }

  function handlePlacementSelect(rank: number) {
    if (!isAdmin || !selectedSport) return;

    const champion = championsData.find(
      (item) => item.rank === rank,
    );

    const today = new Date().toISOString().split("T")[0];

    setFormData({
      id: champion?.id ?? -1,
      gameTypeId: selectedSport,
      rank,
      teamId: champion?.team.id ?? -1,
      startDate: champion?.startDate
        ? new Date(champion.startDate).toISOString().split("T")[0]
        : today,
      endDate: champion?.endDate
        ? new Date(champion.endDate).toISOString().split("T")[0]
        : today,
    });

    setShowDialog(true);
  }

  function handleCloseDialog() {
    setShowDialog(false);
    setFormData(null);
  }

  return (
    <section className="bg-neutral-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <SportSelector
            value={selectedSport}
            onValueChangeAction={handleSportSelect}
            includeAllOption={false}
            placeholder="Select a sport"
            className="h-12 w-full border border-neutral-300 bg-white px-4 shadow-sm sm:w-72"
          />
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {loading ? (
            <StandingsTableSkeleton rows={6} />
          ) : (
            <StandingsTable
              data={standingsData}
              sportName={sportName}
              entryRows={selectedFormat === "MULTI_TEAM"}
            />
          )}

          <TournamentPlacings
            champions={championsData}
            canEdit={isAdmin}
            loading={loading}
            onSelect={handlePlacementSelect}
            multiTeam={selectedFormat === "MULTI_TEAM"}
          />
        </div>
      </div>

      {formData && (
        <StandingFormDialog
          open={showDialog}
          mode={formData.id === -1 ? "add" : "edit"}
          initialData={formData}
          teams={teams}
          onCloseAction={handleCloseDialog}
        />
      )}
    </section>
  );
}
