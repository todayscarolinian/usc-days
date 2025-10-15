//TO-DO: add logos and missing icons (contemporary dance and fallback icon)

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

export default function Standings() {
    const [selectedSport, setSelectedSport] = useState<number | null>(null);
    const [champions, setChampions] = useState<ChampionCard[]>([]);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSports = async () => {
            try {
                const response = await axios.get("/api/sports");
                setGameTypes(response.data.sports);
            } catch (err) {
                console.error("Error fetching sports:", err);
            }
        };
        fetchSports();
    }, []);

    useEffect(() => {
        if (!selectedSport) {
            setChampions([]);
            setStandings([]);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [championsRes, gamesRes, teamsRes] = await Promise.all([
                    axios.get("/api/champions"),
                    axios.get("/api/games"),
                    axios.get("/api/teams"),
                ]);

                const championsData: Champions[] = championsRes.data.champions;
                const gamesData = gamesRes.data.games;
                const teamsData = teamsRes.data.teams;

                // Filter by selected sport
                const championsFiltered = championsData.filter(
                    (c) => c.gameType.id === selectedSport
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
                    return;
                }

                // Process games into standings
                const teamStats: Record<
                    string,
                    { wins: number; losses: number }
                > = {};

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
                const championsProcessed: ChampionCard[] =
                    championsFiltered.map((c) => {
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
                    });

                setStandings(standingsProcessed);
                setChampions(championsProcessed);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
                setStandings([]);
                setChampions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSport]);

    // Get current sport name (this is for TBD cards)
    const currentSport = gameTypes.find((sport) => sport.id === selectedSport);
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
                {error && <p className="text-red-600">Error: {error}</p>}
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
