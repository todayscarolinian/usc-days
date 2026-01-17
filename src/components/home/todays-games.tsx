"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Schedules } from "@/src/types/types";
import { SchedulesCard } from "@/src/components/schedules/schedules-card";
import GameDetailsDialog from "@/src/components/schedules/game-details-dialog";

// sample games for jan 18, 2026
const SAMPLE_GAMES: Schedules[] = [
  {
    id: 1,
    startDate: "2026-01-18T09:00:00",
    endDate: "2026-01-18T10:30:00",
    teamA: {
      id: 14,
      teamName: "SBE Amigos",
    },
    teamB: {
      id: 18,
      teamName: "SBE",
    },
    teamAScore: null,
    teamBScore: null,
    gameType: {
      id: 1,
      gameName: "Men's Basketball",
    },
    location: "Main Court, Downtown Campus",
  },
  {
    id: 2,
    startDate: "2026-01-18T11:00:00",
    endDate: "2026-01-18T12:30:00",
    teamA: {
      id: 19,
      teamName: "SOE",
    },
    teamB: {
      id: 20,
      teamName: "SAS",
    },
    teamAScore: null,
    teamBScore: null,
    gameType: {
      id: 3,
      gameName: "Men's Volleyball",
    },
    location: "Open Court, Downtown Campus",
  },
  {
    id: 3,
    startDate: "2026-01-18T14:00:00",
    endDate: "2026-01-18T15:30:00",
    teamA: {
      id: 15,
      teamName: "SAFAD",
    },
    teamB: {
      id: 17,
      teamName: "SED",
    },
    teamAScore: null,
    teamBScore: null,
    gameType: {
      id: 12,
      gameName: "Football",
    },
    location: "Football Field, Talamban Campus",
  },
  {
    id: 4,
    startDate: "2026-01-18T16:00:00",
    endDate: "2026-01-18T17:30:00",
    teamA: {
      id: 16,
      teamName: "SLG",
    },
    teamB: {
      id: 21,
      teamName: "SBE TITANS",
    },
    teamAScore: null,
    teamBScore: null,
    gameType: {
      id: 2,
      gameName: "Women's Basketball",
    },
    location: "BCT 2, Talamban Campus",
  },
];

export default function TodaysGames() {
  const [selectedGame, setSelectedGame] = useState<Schedules | null>(null);
  const [open, setOpen] = useState(false);

  // mock data
  const todayKey = "2026-01-18";

  // TODO: Uncomment to fetch real data
  // const [todaysGames, setTodaysGames] = useState<Schedules[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // const todayKey = format(new Date(), "yyyy-MM-dd");

  // useEffect(() => {
  //   const fetchTodaysGames = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // Calculate date range for today (start of day to end of day)
  //       const startOfDay = new Date();
  //       startOfDay.setHours(0, 0, 0, 0);
  //       const endOfDay = new Date();
  //       endOfDay.setHours(23, 59, 59, 999);

  //       const params = new URLSearchParams({
  //         startDate: startOfDay.toISOString(),
  //         endDate: endOfDay.toISOString(),
  //       });

  //       const response = await fetch(`/api/games?${params}`);

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch games");
  //       }

  //       const data = await response.json();
  //       const games = data.games || [];

  //       // Sort games by start time
  //       const sorted = games.sort(
  //         (a: Schedules, b: Schedules) =>
  //           new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  //       );

  //       setTodaysGames(sorted);
  //     } catch (err) {
  //       console.error("Error fetching today's games:", err);
  //       setError("Failed to load today's games");
  //       setTodaysGames([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTodaysGames();
  // }, []);

  // if (loading) {
  //   return <div className="p-4">Loading games...</div>;
  // }

  // if (error) {
  //   return <div className="p-4 text-red-600">{error}</div>;
  // }

  // if (todaysGames.length === 0) {
  //   return <div className="p-4 text-gray-600">No games scheduled for today</div>;
  // }

  return (
    <>
    <div className="py-4">
      <h2 className="text-3xl font-bold mb-8">Today's Games</h2>
        <SchedulesCard
          date={todayKey}
          games={SAMPLE_GAMES}
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
    </>
  );
}