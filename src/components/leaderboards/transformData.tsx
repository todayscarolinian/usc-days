import { Schedules } from "@/src/types/types";
import { StandingData } from "@/src/types/types";

export function transformGamesToSchoolRank(
  games: Schedules[],
  sportId?: number
): StandingData[] {
  const leaderboard: Record<
    string,
    { team: string; wins: number; losses: number; sport: string }
  > = {};

  if (sportId !== undefined) {
    games = games.filter((g) => g.gameType.id === sportId);
  }

  for (const g of games) {
    const sport = g.gameType.gameName;

    // Safely get school names
    const teamA = g.teamA.teamName;
    const teamB = g.teamB.teamName;
    const winnerTeam =
      g.winnerId === g.teamA.id
        ? teamA
        : g.winnerId === g.teamB.id
        ? teamB
        : null;

    if (!teamA || !teamB || !winnerTeam) continue; // Skip if any school name is missing or no winner

    // Team A entry
    if (!leaderboard[`${teamA}-${sport}`]) {
      leaderboard[`${teamA}-${sport}`] = {
        team: teamA,
        wins: 0,
        losses: 0,
        sport,
      };
    }
    // Team A entry
    if (!leaderboard[`${teamA}-${sport}`]) {
      leaderboard[`${teamA}-${sport}`] = {
        team: teamA,
        wins: 0,
        losses: 0,
        sport,
      };
    }

    // Team B entry
    if (!leaderboard[`${teamB}-${sport}`]) {
      leaderboard[`${teamB}-${sport}`] = {
        team: teamB,
        wins: 0,
        losses: 0,
        sport,
      };
    }
    // Team B entry
    if (!leaderboard[`${teamB}-${sport}`]) {
      leaderboard[`${teamB}-${sport}`] = {
        team: teamB,
        wins: 0,
        losses: 0,
        sport,
      };
    }

    // Count wins/losses
    if (winnerTeam === teamA) {
      leaderboard[`${teamA}-${sport}`].wins++;
      leaderboard[`${teamB}-${sport}`].losses++;
    } else if (winnerTeam === teamB) {
      leaderboard[`${teamA}-${sport}`].losses++;
      leaderboard[`${teamB}-${sport}`].wins++;
    }
  }

  return Object.values(leaderboard)
    .map((entry, idx) => ({
      id: idx + 1,
      team: entry.team,
      wins: entry.wins,
      losses: entry.losses,
      winPercentage:
        entry.wins + entry.losses > 0
          ? (entry.wins / (entry.wins + entry.losses)) * 100
          : 0,
      sport: entry.sport,
    }))
    .sort((a, b) => b.winPercentage - a.winPercentage);
}
