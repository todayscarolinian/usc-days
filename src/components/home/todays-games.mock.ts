import type { Schedules } from "@/src/types/types";

export function createMockTodaysGames(now: Date): Schedules[] {
  return [
    ["Volleyball", "SOE", "SAS", "Downtown Court"],
    ["Tennis", "SHCP", "SAFAD", "BCT Gym"],
    ["Basketball", "SBE", "SOE", "Downtown Court"],
    ["Badminton", "SED", "SLG", "Talamban Gym"],
    ["Futsal", "SAS", "SAFAD", "BCT Gym"],
  ].map(([sport, home, away, location], index) => {
    const teamAId = -(index * 2 + 1);
    const teamBId = -(index * 2 + 2);
    const team = (id: number, name: string) => ({
      id, teamName: name, schoolId: id, school: { id, schoolName: name },
    });
    return {
      id: -(index + 1), gameTypeId: -(index + 1),
      gameType: { id: -(index + 1), gameName: sport },
      teamAId, teamBId, teamA: team(teamAId, home), teamB: team(teamBId, away),
      location,
      startDate: new Date(now.getTime() + (index === 0 ? -30 : index * 60) * 60_000),
      endDate: new Date(now.getTime() + (index === 0 ? 60 : index * 60 + 90) * 60_000),
      createdAt: now, createdByHeraldId: null,
      teamAScore: null, teamBScore: null, winnerId: null, winner: null,
      teamAForfeited: false, teamBForfeited: false, isDraw: false,
    };
  });
}
