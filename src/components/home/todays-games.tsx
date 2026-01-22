"use client";

import { useEffect, useState, useMemo } from "react";
import { getGamesQuery } from "@/src/queries/games.queries";
import { Schedules } from "@/src/types/types";
import { SchedulesCard } from "@/src/components/schedules/schedules-card";
import GameDetailsDialog from "@/src/components/schedules/game-details-dialog";
import GamesCardSkeleton from "@/src/components/schedules/games-card-skeleton";

export default function TodaysGames() {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);

  const {
    data: allGames = [],
    error,
    isLoading: loading,
  } = getGamesQuery();

  // Get today's date dynamically
  const todayString = useMemo(() => 
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    []
  );

  const todaysGames = useMemo(() => {
    if (!allGames || allGames.length === 0) return [];

    const filtered = allGames.filter((game: Schedules) =>
      game.startDate.includes(todayString)
    );

    return filtered.sort(
      (a: Schedules, b: Schedules) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [allGames, todayString]);

  if (loading) {
    return <GamesCardSkeleton />;
  }

  if (error) {
    return <div className="p-4 text-red-600">Failed to load today's games</div>;
  }

  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold mb-8">Today's Games</h2>
      <SchedulesCard
        date={todayString}
        games={todaysGames}
        onOpenGame={(g) => {
          setSelectedGame(g);
          setOpen(true);
        }}
      />

      <GameDetailsDialog
        open={open}
        onOpenChange={setOpen}
        game={selectedGame}
      />
    </div>
  );
}