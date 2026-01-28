import { Schedules } from "@/src/types/types";
import { StandingData } from "@/src/types/types";

export function transformGamesToSchoolRank(
  games: Schedules[],
  sportId?: number,
): StandingData[] {
  const leaderboard: Record<
    string,
    { team: string; wins: number; losses: number; sport: string }
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

    // Skip if team names are missing or no winner is declared
    if (!teamA || !teamB || !g.winnerId) continue;

    const winnerTeam =
      g.winnerId === g.teamA.id
        ? teamA
        : g.winnerId === g.teamB.id
          ? teamB
          : null;

    if (!winnerTeam) continue;

    // Initialize Team A entry if it doesn't exist
    if (!leaderboard[teamA]) {
      leaderboard[teamA] = {
        team: teamA,
        wins: 0,
        losses: 0,
        sport: sportId !== undefined ? sport : "Overall",
      };
    }

    // Initialize Team B entry if it doesn't exist
    if (!leaderboard[teamB]) {
      leaderboard[teamB] = {
        team: teamB,
        wins: 0,
        losses: 0,
        sport: sportId !== undefined ? sport : "Overall",
      };
    }

    // Update wins/losses
    if (winnerTeam === teamA) {
      leaderboard[teamA].wins++;
      leaderboard[teamB].losses++;
    } else {
      leaderboard[teamB].wins++;
      leaderboard[teamA].losses++;
    }
  }

  return Object.values(leaderboard)
    .map((entry, idx) => {
      const totalGames = entry.wins + entry.losses;
      return {
        id: idx + 1,
        team: entry.team,
        wins: entry.wins,
        losses: entry.losses,
        winPercentage: totalGames > 0 ? (entry.wins / totalGames) * 100 : 0,
        sport: entry.sport,
      };
    })
    .sort((a, b) => b.winPercentage - a.winPercentage);
}
