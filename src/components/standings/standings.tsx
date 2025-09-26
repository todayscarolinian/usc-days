"use client";

import { useState, useEffect } from "react";
import SportSelector from "@/components/standings/sport-selector";
import Cards from "@/components/standings/standings-cards";
import DataTable from "@/components/standings/standings-table";
import standingColumns from "@/components/standings/columns";
import { Champions } from "@/types/types";

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
    const [selectedSport, setSelectedSport] = useState<string | null>(null);
    const [champions, setChampions] = useState<ChampionCard[] | null>(null);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedSport) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // --- Fetch champions & games in parallel ---
                const [championsRes, gamesRes] = await Promise.all([
                    fetch("/api/champions"),
                    fetch("/api/games"),
                ]);

                if (!championsRes.ok)
                    throw new Error("Failed to fetch champions");
                if (!gamesRes.ok) throw new Error("Failed to fetch games");

                const championsJson = await championsRes.json();
                const gamesJson = await gamesRes.json();

                console.log("Raw champions data:", championsJson);
                console.log("Raw games data:", gamesJson);

                const championsData: Champions[] = championsJson.champions;
                const gamesData = gamesJson.games; // array of games

                // --- CHECK ALL GAME TYPES ---
                console.log(
                    "All champion game types:",
                    championsData.map((c) => c.gameType.gameName)
                );
                console.log(
                    "All game game types:",
                    gamesData.map((g: any) => g.gameType.gameName)
                );

                // --- Filter by selected sport ---
                const championsFiltered = championsData.filter(
                    (c) => c.gameType.gameName === selectedSport
                );

                const gamesFiltered = gamesData.filter(
                    (g: any) => g.gameType.gameName === selectedSport
                );

                console.log("Filtered champions:", championsFiltered);
                console.log("Filtered games:", gamesFiltered);

                // --- Build a team ID → name map ---
                const teamIdToName: Record<number, string> = {};
                championsData.forEach((c) => {
                    teamIdToName[c.team.id] = c.team.teamName;
                });
                gamesData.forEach((g: any) => {
                    teamIdToName[g.teamAId] ??= g.teamAName; // if you include teamAName in response
                    teamIdToName[g.teamBId] ??= g.teamBName; // same
                });

                // --- Compute standings ---
                const teamStats: Record<
                    string,
                    { wins: number; losses: number }
                > = {};

                gamesFiltered.forEach((game: any) => {
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

                console.log("Computed team stats:", teamStats);

                const standingsProcessed: Standing[] = Object.entries(
                    teamStats
                ).map(([team, { wins, losses }]) => {
                    const total = wins + losses;
                    const winPct =
                        total > 0
                            ? `${Math.round((wins / total) * 100)}%`
                            : "0%";
                    return { team, wins, losses, winPct };
                });

                console.log("Processed standings:", standingsProcessed);

                // --- Prepare champions for cards ---
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

                console.log(
                    "Processed champions for cards:",
                    championsProcessed
                );

                setStandings(standingsProcessed);
                setChampions(championsProcessed);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSport]);

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <SportSelector
                    selected={selectedSport}
                    onSelect={setSelectedSport}
                />
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {selectedSport && !loading && champions && (
                    <>
                        <Cards data={champions} />
                        <DataTable columns={standingColumns} data={standings} />
                    </>
                )}
            </div>
        </div>
    );
}
