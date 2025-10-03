"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/types/types";
import AddScheduleDialog from "./add-schedule-dialog";


export default function SchedulesPage() {
    const [gamesData, setGamesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
          try {
            const { data } = await axios.get("/api/games");
            const rows: any[] = Array.isArray(data) ? data : data.games;
            const mapped: Schedules[] = rows.map((g: any) => ({
              id: g.id,
              startDate: g.startDate,
              endDate: g.endDate,
              gameType: { id: g.gameTypeId, gameName: g.gameType?.name ?? "—" },
              teamA: { id: g.teamAId, teamName: g.teamA?.name ?? `Team ${g.teamAId}` },
              teamB: { id: g.teamBId, teamName: g.teamB?.name ?? `Team ${g.teamBId}` },
              score:
                g.teamAScore != null && g.teamBScore != null
                ? { teamAScore: Number(g.teamAScore), teamBScore: Number(g.teamBScore) }
                  : null,
              location: g.location ?? undefined,
            }));
      
            setGamesData(mapped);
          } catch (e: any) {
            setError(e?.message ?? "Failed to load games");
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
            {/* <div className="mx-auto sm:max-w-360">
                <DataTable
                    columns={scheduleColumns}
                    data={gamesData}
                    actionButton={<AddScheduleDialog />}
                />
            </div> */}
        </div>
    );
}
