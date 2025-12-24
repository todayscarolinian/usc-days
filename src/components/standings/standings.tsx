//TO-DO: add logos and missing icons (contemporary dance and fallback icon)

"use client";

import { useState, useEffect } from "react";
import { getChampionsQuery } from "@/queries/champions.queries";
import { getGameTypesQuery } from "@/queries/gametypes.queries";
import { getGamesQuery } from "@/queries/games.queries";
import { getTeamsQuery } from "@/queries/teams.queries";
import SportSelector from "@/components/standings/sport-selector";
import Cards from "@/components/standings/standings-cards";
import StandingsCardsSkeleton from "@/components/standings/standings-cards-skeleton";
import DataTable from "@/components/standings/standings-table";
import StandingsTableSkeleton from "@/components/standings/standings-table-skeleton";
import standingColumns from "@/components/standings/columns";
import { Champions } from "@/types/types";

type GameType = {
    id: number;
    gameName: string;
};

type Team = {
    id: number;
    teamName: string;
};

type Game = {
    gameType: GameType | null;
    teamAId: number;
    teamBId: number;
    winnerId: number | null;
};

type ChampionCard = {
    team: string;
    wins: number;
    winPct: string;
    rank: number;
    gameType: string;
};

type Standing = {
    team: string;
    wins: number;
    losses: number;
    winPct: string;
};

/*
    MAIN OPTIMIZATION: Loads all data on render, timeout is set to simulate loading
*/

export default function Standings() {
    const [selectedSport, setSelectedSport] = useState<number | null>(null);
    const [champions, setChampions] = useState<ChampionCard[]>([]);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: sportsData = [], error: sportsError } = getGameTypesQuery();
    const { data: championsData = [], error: championsError } =
        getChampionsQuery();
    const { data: gamesData = [], error: gamesError } = getGamesQuery();
    const { data: teamsData = [], error: teamsError } = getTeamsQuery();

    const error = sportsError || championsError || gamesError || teamsError;

    useEffect(() => {
        if (!selectedSport) return;
        if (!gamesData || !championsData || !teamsData) return;
        if (
            gamesData.length === 0 &&
            standings.length === 0 &&
            champions.length === 0
        )
            return;

        setLoading(true);

        const load = setTimeout(() => {
            const championsFiltered = championsData.filter(
                (c: Champions) => c.gameType.id === selectedSport
            );

            const gamesFiltered = gamesData.filter(
                (g: Game) => g.gameType?.id === selectedSport
            );

            // Build team mapping from teams API
            const teamIdToName: Record<number, string> = {};
            teamsData.forEach((team: Team) => {
                teamIdToName[team.id] = team.teamName;
            });

            // Early return if no data to process
            if (gamesFiltered.length === 0) {
                setStandings([]);
                setChampions([]);
                setLoading(false);
                return;
            }

            // Process games into standings
            const teamStats: Record<string, { wins: number; losses: number }> =
                {};

            gamesFiltered.forEach((game: Game) => {
                const teamA = teamIdToName[game.teamAId];
                const teamB = teamIdToName[game.teamBId];
                const winner = game.winnerId
                    ? teamIdToName[game.winnerId]
                    : null;

                if (!teamStats[teamA])
                    teamStats[teamA] = { wins: 0, losses: 0 };
                if (!teamStats[teamB])
                    teamStats[teamB] = { wins: 0, losses: 0 };

                if (winner) {
                    teamStats[winner].wins += 1;
                    const loser = winner === teamA ? teamB : teamA;
                    teamStats[loser].losses += 1;
                }
            });

            // Prepare standings for table
            const standingsProcessed: Standing[] = Object.entries(
                teamStats
            ).map(([team, { wins, losses }]) => {
                const total = wins + losses;
                const winPct =
                    total > 0
                        ? (() => {
                              const pct = (wins / total) * 100;
                              if (pct === 0 || pct === 100)
                                  return `${Math.round(pct)}%`;
                              return `${parseFloat(pct.toFixed(2))}%`;
                          })()
                        : "0%";
                return { team, wins, losses, winPct };
            });

            // Sort by Win% in descending order (highest to lowest)
            standingsProcessed.sort((a, b) => {
                const pctA = parseFloat(a.winPct.replace("%", ""));
                const pctB = parseFloat(b.winPct.replace("%", ""));
                return pctB - pctA;
            });

            // Prepare champions for cards
            const championsProcessed: ChampionCard[] = championsFiltered.map(
                (c: Champions) => {
                    const stats = standingsProcessed.find(
                        (s) => s.team === c.team.teamName
                    );
                    return {
                        team: c.team.teamName,
                        wins: stats?.wins ?? 0,
                        winPct: stats?.winPct ?? "0%",
                        rank: c.rank,
                        gameType: c.gameType.gameName,
                    };
                }
            );
            setStandings(standingsProcessed);
            setChampions(championsProcessed);
            setLoading(false);
        }, 500);

        return () => clearTimeout(load);
    }, [championsData, gamesData, teamsData, selectedSport]);

    const currentSport = sportsData.find((sport) => sport.id === selectedSport);
    const currentSportName = currentSport?.gameName || "";

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <SportSelector
                    selected={selectedSport}
                    onSelect={setSelectedSport}
                />
                {loading && selectedSport && (
                    <>
                        <StandingsCardsSkeleton />
                        <StandingsTableSkeleton rows={6} />
                    </>
                )}
                {error && (
                    <p className="text-red-600">Error: {error.message}</p>
                )}
                {selectedSport && !loading && !error && (
                    <>
                        <Cards
                            data={champions}
                            currentSport={currentSportName}
                        />
                        <DataTable columns={standingColumns} data={standings} />
                    </>
                )}
            </div>
        </div>
    );
}
