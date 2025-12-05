//TO-DO: add logos and missing icons (contemporary dance and fallback icon)

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import SportSelector from "@/components/ui/sport-selector";
import Cards from "@/components/standings/standings-cards";
import StandingsCardsSkeleton from "@/components/standings/standings-cards-skeleton";
import DataTable from "@/components/standings/standings-table";
import StandingsTableSkeleton from "@/components/standings/standings-table-skeleton";
import standingColumns from "@/components/standings/columns";
import { Button } from "@/components/ui/button";
import { Champion, GameType, Team } from "@prisma/client";
import { transformGamesToSchoolRank } from "../leaderboards/transformData";
import { StandingData } from "@/types/types";
import { useInitializeUserStore, useUserStore } from "@/stores/user-store";
import { EditChampionPayload } from "@/types/champions.types";
import StandingFormDialog from "./standing-dialog-form";
import { toast } from "sonner";

type ChampionData = Champion & {
    gameType: {
        id: number;
        gameName: string;
    };
    team: {
        id: number;
        teamName: string;
    };
};

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
    // Static data (fetched once)
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    // Dynamic data (changes per sport selection)
    const [selectedSport, setSelectedSport] = useState<number | null>(null);
    const [championsData, setChampionsData] = useState<ChampionData[]>([]);
    const [standingsData, setStandingsData] = useState<StandingWithRank[]>([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [formData, setFormData] = useState<EditChampionPayload | null>(null);

    useInitializeUserStore();
    const { email } = useUserStore();
    const isAdmin = !!email;

    // Fetch static data once on mount
    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const [sportsRes, teamsRes] = await Promise.all([
                    axios.get("/api/sports"),
                    axios.get("/api/teams"),
                ]);

                setGameTypes(sportsRes.data.sports || []);
                setTeams(teamsRes.data.teams || []);
            } catch (err) {
                console.error("Error fetching static data:", err);
                toast.error("Failed to load sports and teams data");
            }
        };

        fetchStaticData();
    }, []);

    // Fetch dynamic data when sport changes
    const fetchStandingsData = useCallback(async () => {
        if (!selectedSport) {
            setStandingsData([]);
            setChampionsData([]);
            return;
        }

        try {
            setLoading(true);

            const [championsRes, gamesRes] = await Promise.all([
                axios.get(`/api/champions?gameTypeId=${selectedSport}`),
                axios.get(`/api/games?gameTypeId=${selectedSport}`),
            ]);

            const champions: ChampionData[] = championsRes.data.champions || [];
            const games = gamesRes.data.games || [];

            setChampionsData(champions);

            // Transform games to standings statistics
            const gameStandings = transformGamesToSchoolRank(games);

            // Create comprehensive standings list
            const allStandings: StandingWithRank[] = [];

            // Add teams with game statistics
            gameStandings.forEach((standing) => {
                const champion = champions.find(
                    (c) => c.team.teamName === standing.team
                );
                allStandings.push({
                    ...standing,
                    rank: champion?.rank || 0,
                });
            });

            // Add champions without game history
            champions.forEach((champion) => {
                const existingStanding = allStandings.find(
                    (s) => s.team === champion.team.teamName
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
            console.error("Error fetching standings data:", err);
            toast.error("Failed to load standings data");
            setStandingsData([]);
            setChampionsData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedSport]);

    useEffect(() => {
        fetchStandingsData();
    }, [fetchStandingsData]);

    // Memoized computed values
    const sportName = useMemo(
        () =>
            gameTypes.find((sport) => sport.id === selectedSport)?.gameName ||
            "",
        [gameTypes, selectedSport]
    );

    const topThreeCards = useMemo(() => {
        const cards: CardData[] = [1, 2, 3].map((rank) => {
            const champion = championsData.find((c) => c.rank === rank);

            if (champion) {
                const standing = standingsData.find(
                    (s) => s.team === champion.team.teamName
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
        [championsData, selectedSport]
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
        [fetchStandingsData]
    );

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto max-w-[96%] space-y-6">
                <div className="flex justify-between items-center">
                    <SportSelector
                        selected={selectedSport}
                        onSelect={setSelectedSport}
                        triggerClassName="flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] min-w-full bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden"
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
                        <DataTable
                            columns={standingColumns}
                            data={standingsData}
                        />
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
