"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Schedules } from "@/src/types/types"; // replace with API later
import { SchedulesCard } from "./schedules-card";
import GameDetailsDialog from "./game-details-dialog";
import EditScheduleDialog from "./edit-schedule-dialog";
import AddScoreDialog from "./add-score-dialog";
type SchedulesListProps = {
  games: Schedules[];
};

export default function SchedulesList({ games }: SchedulesListProps) {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);
  const [editGame, setEditGame] = useState<Schedules | null>(null);
  const [showAddScore, setShowAddScore] = useState(false);

  const grouped = games.reduce<Record<string, Schedules[]>>((acc, game) => {
    const dayKey = format(new Date(game.startDate), "yyyy-MM-dd");
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(game);
    return acc;
  }, {});

  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  });

  const todayKey = format(new Date(), "yyyy-MM-dd");

  if (!grouped[todayKey]) {
    grouped[todayKey] = [];
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const orderedDates = [
    todayKey,
    ...sortedDates.filter((date) => date !== todayKey),
  ];

  // state to control how many days to show
  const [visibleCount, setVisibleCount] = useState(1); // show today initially
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(
            (prev) => Math.min(prev + 1, orderedDates.length) // load max of 1 more
          );
        }
      },
      { threshold: 1.0 } // fully visible before loading
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [orderedDates.length]);

  return (
    <div className="flex flex-col items-center gap-15 w-full">
      {orderedDates.slice(0, visibleCount).map((date) => (
        <SchedulesCard
          key={date}
          date={date}
          games={grouped[date]}
          onOpenGame={(g) => {
            setSelectedGame(g);
            setOpen(true);
          }}
        />
      ))}

      {visibleCount < orderedDates.length && (
        <div ref={loadMoreRef} className="h-10 w-full" />
      )}

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
            if (!v) setEditGame(null); // close edit dialog
          }}
        />
      )}
      <AddScoreDialog
        open={showAddScore}
        onOpenChange={setShowAddScore}
        game={selectedGame}
        // onSaved={(_updated) => {
        //   // future improvements can be made here
        // }}
      />
    </div>
  );
}
