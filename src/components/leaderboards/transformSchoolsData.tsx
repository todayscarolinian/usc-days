import { Schedules } from "@/src/types/types";
import { StandingData } from "@/src/types/types";
import { schoolLogos } from "@/src/constants/schoolLogos";

export function transformSchoolsData(
  games: Schedules[],
  sportId?: number,
): StandingData[] {
  // Get school keys (e.g., SOE, SAFAD, etc.)
  const schoolKeys = Object.keys(schoolLogos).filter((k) => k !== "Default");

  // Helper to get school from team name
  function getSchoolFromTeam(teamName: string): string | null {
    if (!teamName) return null;
    const match = schoolKeys.find((school) =>
      teamName.toLowerCase().startsWith(school.toLowerCase()),
    );
    return match || null;
  }

  const leaderboard: Record<
    string,
    { school: string; wins: number; losses: number; sport: string }
  > = {};

  // Filter by sport if specified
  const filteredGames =
    sportId !== undefined
      ? games.filter((g) => g.gameType.id === sportId)
      : games;

  for (const g of filteredGames) {
    const sport = g.gameType.gameName;
    const teamA = g.teamA.teamName;
    const teamB = g.teamB.teamName;

    // Map team names to schools
    const schoolA = getSchoolFromTeam(teamA);
    const schoolB = getSchoolFromTeam(teamB);

    // Omit if either team does not match a school
    if (!schoolA || !schoolB) continue;

    // Initialize School A entry if it doesn't exist
    if (!leaderboard[schoolA]) {
      leaderboard[schoolA] = {
        school: schoolA,
        wins: 0,
        losses: 0,
        sport: sportId !== undefined ? sport : "Overall",
      };
    }

    // Initialize School B entry if it doesn't exist
    if (!leaderboard[schoolB]) {
      leaderboard[schoolB] = {
        school: schoolB,
        wins: 0,
        losses: 0,
        sport: sportId !== undefined ? sport : "Overall",
      };
    }

    // Handle both teams forfeiting - both get a loss
    if (g.teamAForfeited && g.teamBForfeited) {
      leaderboard[schoolA].losses++;
      leaderboard[schoolB].losses++;
      continue;
    }

    // Skip draws - no wins or losses for either team
    if (g.isDraw) {
      continue;
    }

    // Skip if no winner is declared and no forfeits
    if (!g.winnerId) continue;

    const winnerSchool =
      g.winnerId === g.teamA.id
        ? schoolA
        : g.winnerId === g.teamB.id
          ? schoolB
          : null;

    if (!winnerSchool) continue;

    // Update wins/losses
    if (winnerSchool === schoolA) {
      leaderboard[schoolA].wins++;
      leaderboard[schoolB].losses++;
    } else {
      leaderboard[schoolB].wins++;
      leaderboard[schoolA].losses++;
    }
  }

  return Object.values(leaderboard)
    .map((entry, idx) => {
      const totalGames = entry.wins + entry.losses;
      return {
        id: idx + 1,
        team: entry.school, // 'team' field now holds the school name
        wins: entry.wins,
        losses: entry.losses,
        winPercentage: totalGames > 0 ? (entry.wins / totalGames) * 100 : 0,
        sport: entry.sport,
      };
    })
    .sort((a, b) => b.winPercentage - a.winPercentage);
}
