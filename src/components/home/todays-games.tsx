"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { getGamesQuery } from "@/src/queries/games.queries";
import { Schedules } from "@/src/types/types";
import { SchedulesCard } from "@/src/components/schedules/schedules-card";
import GameDetailsDialog from "@/src/components/schedules/game-details-dialog";
import SchedulesCardSkeleton from "@/src/components/schedules/schedules-card-skeleton";

function GamesContent({
  dateLabel,
  onOpenGame,
}: {
  dateLabel: string;
  onOpenGame: (g: Schedules) => void;
}) {

  const { data: allGames = [], error, isLoading: loading } = getGamesQuery();

  const todaysGames = useMemo(() => {
    if (!allGames || allGames.length === 0) return [];
    const filtered = allGames.filter((game: Schedules) =>
      game.startDate.includes(dateLabel)
    );
    return filtered.sort(
      (a: Schedules, b: Schedules) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [allGames, dateLabel]);

  if (loading) return <SchedulesCardSkeleton rows={2} />;

  if (error) {
    return (
      <div className="p-4 text-red-600">Failed to load today&apos;s games</div>
    );
  }

  return (
    <SchedulesCard date={dateLabel} games={todaysGames} onOpenGame={onOpenGame} />
  );
}

export default function TodaysGames() {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const todayString = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    []
  );

  if (!inView) {
    return (
      <div ref={sectionRef}>
        <SchedulesCardSkeleton rows={2} />
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="py-4">
      <h2 className="text-3xl font-bold mb-8">Today&apos;s Games</h2>
      <GamesContent
        dateLabel={todayString}
        onOpenGame={(g) => {
          setSelectedGame(g);
          setOpen(true);
        }}
      />
      <GameDetailsDialog open={open} onOpenChange={setOpen} game={selectedGame} />
    </div>
  );
}