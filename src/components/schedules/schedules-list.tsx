"use client";

import { Schedules } from "@/types/types"; // replace with API later
import { SchedulesCard } from "./schedules-card";
import { format } from "date-fns";
import { useState } from "react";
import GameDetailsDialog from "./game-details-dialog";
import EditScheduleDialog from "./edit-schedule-dialog"; 
type SchedulesListProps = {
  games: Schedules[];
};

export default function SchedulesList({ games }: SchedulesListProps) {
    const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
    const [open, setOpen] = useState(false);
    const [editGame, setEditGame] = useState<Schedules | null>(null);
    const grouped = games.reduce<Record<string, Schedules[]>>((acc, game) => {
        const dayKey = format(new Date(game.startDate), "yyyy-MM-dd");
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(game);
        return acc;
    }, {});   

    const todayKey = format(new Date(), "yyyy-MM-dd");

    if (!grouped[todayKey]) {
        grouped[todayKey] = [];
    }

    const sortedDates = Object.keys(grouped).sort();

    return (
      <div className="flex flex-col items-center gap-6">
        {sortedDates.map((date) => (
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
        <GameDetailsDialog
          open={open}
          onOpenChange={setOpen}
          game={selectedGame}
          onEditSchedule={(g) => {
            setEditGame(g);
            setOpen(false); // close details dialog
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

      </div>
    );
}
