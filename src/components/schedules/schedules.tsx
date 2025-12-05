"use client";

import { useEffect, useState } from "react";
import SchedulesList from "@/src/components/schedules/schedules-list"; // cards view
import axios from "axios";
import { Schedules } from "@/src/types/types";
import AddScheduleDialog from "./add-schedule-dialog";
import DayNavigation from "./day-navigation";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import SchedulesListSkeleton from "./schedules-list-skeleton";

export default function SchedulesPage() {
  const [gamesData, setGamesData] = useState<Schedules[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<number | null>(null);

  useInitializeUserStore();
  const { email } = useUserStore();

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        const {
          data: { games: fetchedGamesData },
        } = await axios.get("/api/games");

        let filteredData = fetchedGamesData;

        if (selectedSport && selectedSport !== 0) {
          filteredData = fetchedGamesData.filter(
            (game: Schedules) => game.gameType.id === selectedSport
          );
        }

        setGamesData(filteredData);
      } catch (err) {
        console.error("Error fetching games data:", err);
        setError("Failed to load games data");
      } finally {
        setLoading(false);
      }
    };

    fetchGamesData();
  }, [selectedSport]);

  return (
    <>
      <DayNavigation onSelect={setSelectedSport} selected={selectedSport} />
      <div className="p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
        <div className="flex flex-col gap-4">
          {email && (
            <div className="flex justify-end">
              <AddScheduleDialog />
            </div>
          )}
          {loading || error ? (
            <SchedulesListSkeleton days={1} rowsPerDay={2} error={error} />
          ) : (
            <SchedulesList games={gamesData} />
          )}
        </div>
      </div>
    </>
  );
}
