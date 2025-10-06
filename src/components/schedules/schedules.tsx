"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";


type Row = {
    id: number | string;
    startDate: string | Date;
    endDate: string | Date;
    gameTypeId: number;
    teamAId: number;
    teamBId: number;
    teamAScore?: number | string | null;
    teamBScore?: number | string | null;
    gameType?: { gameName?: string; name?: string } | null;
    teamA?: { name?: string; teamName?: string } | null;
    teamB?: { name?: string; teamName?: string } | null;
    location?: string | null;
  };
export default function SchedulesPage() {
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
      
      type ApiGamesResponse = { games: Row[]; count: number };
      
      const toNumOrNull = (v: unknown): number | null => {
        if (v == null) return null;
        const n = typeof v === "string" ? Number(v.trim()) : typeof v === "number" ? v : NaN;
        return Number.isFinite(n) ? n : null;
      };
      
      const toISO = (v: string | Date) => (typeof v === "string" ? v : new Date(v).toISOString());
      
      const toSchedules = (g: Row): Schedules => {
        const a = toNumOrNull(g.teamAScore);
        const b = toNumOrNull(g.teamBScore);
        return {
          id: Number(g.id),
          startDate: toISO(g.startDate),
          endDate: toISO(g.endDate),
          gameType: {
            id: g.gameTypeId,
            gameName: (g.gameType?.gameName ?? g.gameType?.name ?? "").trim(),
          },
          teamA: {
            id: g.teamAId,
            teamName: (g.teamA?.teamName ?? g.teamA?.name ?? `Team ${g.teamAId}`).trim(),
          },
          teamB: {
            id: g.teamBId,
            teamName: (g.teamB?.teamName ?? g.teamB?.name ?? `Team ${g.teamBId}`).trim(),
          },
          score: a == null || b == null ? null : { teamAScore: a, teamBScore: b },
          location: g.location ?? undefined,
        };
      };
      
      useEffect(() => {
        (async () => {
          try {
            const { data } = await axios.get<ApiGamesResponse>("/api/games");
            const rows = Array.isArray(data) ? (data as Row[]) : data.games;
            const mapped: Schedules[] = rows.map(toSchedules);
            setGamesData(mapped);
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load games");
          } finally {
            setLoading(false);
          }
        })();
      }, []);
      

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                    <AddScheduleDialog />
                </div>
                <SchedulesList games={gamesData} />
            </div>
        </div>
    );
}