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
import StandingFormDialog from "@/components/standings/standing-dialog-form";
import DeleteConfirmDialog from "@/components/standings/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddChampionPayload} from "@/types/champions.types";

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
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingStanding, setEditingStanding] = useState<AddChampionPayload | null>(null);
    const isAdmin = true;

    const handleDeleteStanding = () => {
        if (!editingStanding) return;
        toast.error(`Standing deleted successfully`);
        setEditingStanding(null);
        setShowDeleteDialog(false);
        setShowAddDialog(false);
    };

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

                // Set teams state
                setTeams(teamsData);

                // Build team mapping from teams API
                const teamIdToName: Record<number, string> = {};
                teamsData.forEach((team: Team) => {
                    teamIdToName[team.id] = team.teamName;
                });

                // Early return if no data to process
                if (gamesFiltered.length === 0) {
                    // setStandings([]);
                    // setChampions([]);
                    // return;
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
                
                console.log("Processed Champions: ", championsProcessed);

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

    useEffect(() => {
        if (!selectedSport) {
            setChampions([]);
            setStandings([]);
            return;
        }

        fetchData();
    }, [selectedSport]);

    // Get current sport name (this is for TBD cards)
    const currentSport = gameTypes.find((sport) => sport.id === selectedSport);
    const currentSportName = currentSport?.gameName || "";

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <div className="flex justify-between items-center">
                    <SportSelector
                    selected={selectedSport}
                    onSelect={setSelectedSport}
                    />
                    {isAdmin && (
                        <Button
                            variant="default"
                            disabled={!selectedSport}
                            onClick={() => {
                                setEditingStanding(null); 
                                setShowAddDialog(false);
                                setTimeout(() => setShowAddDialog(true), 0);
                            }}
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
                {error && <p className="text-red-600" onClick={fetchData}>Error: {error}</p>}
                {selectedSport && !loading && !error && (
                    <>
                        <Cards
                            data={champions}
                            currentSport={currentSportName}
                            onCardClick={(champion) => {
                                if (!isAdmin) return;
                                setEditingStanding({
                                    teamId: 0, // you'll map this later once real team IDs are available
                                    gameTypeId: selectedSport!, // ✅ auto-fill from currently selected sport
                                    rank: champion.rank,
                                    startDate: new Date().toISOString(),
                                    endDate: new Date().toISOString(),
                                });
                                setShowAddDialog(true);
                            }}
                        />
                        <DataTable 
                            columns={standingColumns} 
                            data={standings} 
                        />
                    </>
                )}
            </div>
            <StandingFormDialog
                open={showAddDialog}
                mode={editingStanding ? "edit" : "add"}
                initialData={editingStanding} 
                selectedSport={selectedSport ?? 0}
                teams={teams}
                onClose={() => {
                    setShowAddDialog(false);
                    setEditingStanding(null); 
                }}
                onSubmit={(_data) => {
                    if (editingStanding) {
                        // still update existing row
                        toast.success(`Standing updated successfully`);
                    } else {
                        // just show a success toast; don’t mutate UI
                        toast.success(`Standing added successfully`);
                    }
                    setShowAddDialog(false);
                    setEditingStanding(null);
                }}
                onDelete={() => setShowDeleteDialog(true)}
            />

            <DeleteConfirmDialog
            open={showDeleteDialog}
            // itemName={editingStanding?.team}
            // itemName={`Team ${editingStanding?.teamId ?? ""}`}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDeleteStanding}
            />
        </div>
    );
}
