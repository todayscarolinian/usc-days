"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Schedules, filterType } from "@/src/types/types";
import { fetchGamesPage } from "@/src/services/games.client";
import { SchedulesCard } from "./schedules-card";
import GameDetailsDialog from "./game-details-dialog";
import EditScheduleDialog from "./edit-schedule-dialog";
import AddScoreDialog from "./add-score-dialog";
import SchedulesListSkeleton from "./schedules-list-skeleton";

type SchedulesListProps = {
  filters?: filterType;
};

export default function SchedulesList({ filters }: SchedulesListProps) {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);
  const [editGame, setEditGame] = useState<Schedules | null>(null);
  const [showAddScore, setShowAddScore] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["games", "schedules", filters],
    queryFn: ({ pageParam }) => fetchGamesPage(pageParam, 20, filters),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : null;
    },
    staleTime: 1000 * 60 * 5,
  });

  const allGames: Schedules[] = useMemo(() => {
    if (!data?.pages) return [];
    
    const seen = new Set<number>();
    const games: Schedules[] = [];
    
    for (const page of data.pages) {
      for (const game of page.games) {
        if (!seen.has(game.id)) {
          seen.add(game.id);
          games.push(game);
        }
      }
    }
    
    return games;
  }, [data?.pages]);

  const { grouped, orderedDates } = useMemo(() => {
    const groupedByDay = allGames.reduce<Record<string, Schedules[]>>(
      (acc, game) => {
        const dayKey = format(new Date(game.startDate), "yyyy-MM-dd");
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(game);
        return acc;
      },
      {}
    );

    Object.keys(groupedByDay).forEach((date) => {
      groupedByDay[date].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    });

    const todayKey = format(new Date(), "yyyy-MM-dd");
    if (!groupedByDay[todayKey]) {
      groupedByDay[todayKey] = [];
    }

    const sortedDates = Object.keys(groupedByDay).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const ordered = [
      todayKey,
      ...sortedDates.filter((d) => d !== todayKey),
    ];

    return { grouped: groupedByDay, orderedDates: ordered };
  }, [allGames]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return <SchedulesListSkeleton days={1} rowsPerDay={2} />;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-red-500 font-medium">Failed to load schedules</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const hasGames = allGames.length > 0;

  return (
    <div className="flex flex-col items-center gap-15 w-full">
      {!hasGames && !isFetching && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No games scheduled</p>
        </div>
      )}

      {orderedDates.map((date) => (
        <SchedulesCard
          key={date}
          date={date}
          games={grouped[date] ?? []}
          onOpenGame={(g) => {
            setSelectedGame(g);
            setOpen(true);
          }}
        />
      ))}

      {/* Loading sentinel for infinite scroll */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-20 w-full flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Loading more games...
              </span>
            </div>
          )}
        </div>
      )}

      {!hasNextPage && hasGames && (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground">
            You&apos;ve reached the end
          </p>
        </div>
      )}

      {/* Dialogs */}
      <GameDetailsDialog
        open={open}
        onOpenChange={setOpen}
        game={selectedGame}
        onEditSchedule={(g) => {
          setEditGame(g);
          setOpen(false);
        }}
        onAddScore={(g) => {
          setSelectedGame(g);
          setShowAddScore(true);
        }}
      />

      {editGame && (
        <EditScheduleDialog
          schedule={editGame}
          open={!!editGame}
          onOpenChange={(v) => {
            if (!v) setEditGame(null);
          }}
        />
      )}

      <AddScoreDialog
        open={showAddScore}
        onOpenChange={setShowAddScore}
        game={selectedGame}
      />
    </div>
  );
}