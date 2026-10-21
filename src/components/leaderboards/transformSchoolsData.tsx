import { Schedules } from "@/src/types/types";
import { StandingData } from "@/src/types/types";
import { comparePlacings, isMultiTeam, placingKey } from "@/src/lib/multi-team";

export function transformSchoolsData(
  games: Schedules[],
  sportId?: number,
): StandingData[] {
  const leaderboard: Record<
    string,
    {
      school: string;
      wins: number;
      losses: number;
      draws: number;
      sport: string;
      firsts: number;
      seconds: number;
      thirds: number;
    }
  > = {};

  function ensureSchool(school: string, sport: string) {
    leaderboard[school] ??= {
      school,
      wins: 0,
      losses: 0,
      draws: 0,
      sport: sportId !== undefined ? sport : "Overall",
      firsts: 0,
      seconds: 0,
      thirds: 0,
    };
    return leaderboard[school];
  }

  // Filter by sport if specified
  const filteredGames =
    sportId !== undefined
      ? games.filter((g) => g.gameType.id === sportId)
      : games;

  for (const g of filteredGames) {
    // Multi-team games add placings only; win/loss/draw stays head-to-head.
    if (isMultiTeam(g)) {
      for (const { rank, team } of g.participants) {
        const key = placingKey(rank);
        if (key) ensureSchool(team.school.schoolName, g.gameType.gameName)[key]++;
      }
      continue;
    }

    if (!g.teamA || !g.teamB) continue;

    const sport = g.gameType.gameName;

    // Each team belongs to exactly one school
    const schoolA = g.teamA.school.schoolName;
    const schoolB = g.teamB.school.schoolName;

    ensureSchool(schoolA, sport);
    ensureSchool(schoolB, sport);

    // Handle both teams forfeiting - both get a loss
    if (g.teamAForfeited && g.teamBForfeited) {
      leaderboard[schoolA].losses++;
      leaderboard[schoolB].losses++;
      continue;
    }

    // Draws count for both schools but not toward wins or losses
    if (g.isDraw) {
      leaderboard[schoolA].draws++;
      leaderboard[schoolB].draws++;
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
        draws: entry.draws,
        winPercentage: totalGames > 0 ? (entry.wins / totalGames) * 100 : 0,
        sport: entry.sport,
        firsts: entry.firsts,
        seconds: entry.seconds,
        thirds: entry.thirds,
      };
    })
    .sort((a, b) => b.winPercentage - a.winPercentage || comparePlacings(a, b));
}
