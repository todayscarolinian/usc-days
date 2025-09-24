"use client";

import { Schedules } from "@/types/types"; // replace with API later
import { SchedulesCard } from "./schedules-card";
import { format } from "date-fns";

type SchedulesListProps = {
  games: Schedules[];
};

export default function SchedulesList({ games }: SchedulesListProps) {
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
        <SchedulesCard key={date} date={date} games={grouped[date]} />
      ))}
    </div>
  );
}
