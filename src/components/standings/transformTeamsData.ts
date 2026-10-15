import { Schedules, StandingData } from "@/src/types/types";

export type TeamStandingData = StandingData & {
  played: number;
};

type MutableStanding = {
  id: number;
  team: string;
  wins: number;
  losses: number;
  played: number;
  sport: string;
};

export function transformTeamsData(
  games: Schedules[],
  sportId?: number,
): TeamStandingData[] {
  const standings = new Map<number, MutableStanding>();

  const filteredGames =
    sportId !== undefined
      ? games.filter((game) => game.gameType.id === sportId)
      : games;

  function ensureTeam(
    id: number,
    team: string,
    sport: string,
  ): MutableStanding {
    const existing = standings.get(id);

    if (existing) {
      return existing;
    }

    const standing: MutableStanding = {
      id,
      team,
      wins: 0,
      losses: 0,
      played: 0,
      sport: sportId !== undefined ? sport : "Overall",
    };

    standings.set(id, standing);
    return standing;
  }

  for (const game of filteredGames) {
    if (!game.teamA || !game.teamB) continue;

    const teamAName = game.teamA.teamName;
    const teamBName = game.teamB.teamName;

    if (!teamAName || !teamBName) continue;

    const teamA = ensureTeam(
      game.teamA.id,
      teamAName,
      game.gameType.gameName,
    );
    const teamB = ensureTeam(
      game.teamB.id,
      teamBName,
      game.gameType.gameName,
    );

    if (game.teamAForfeited && game.teamBForfeited) {
      teamA.played++;
      teamB.played++;
      teamA.losses++;
      teamB.losses++;
      continue;
    }

    if (game.isDraw) {
      teamA.played++;
      teamB.played++;
      continue;
    }

    if (!game.winnerId) continue;

    teamA.played++;
    teamB.played++;

    if (game.winnerId === game.teamA.id) {
      teamA.wins++;
      teamB.losses++;
    } else if (game.winnerId === game.teamB.id) {
      teamB.wins++;
      teamA.losses++;
    }
  }

  return Array.from(standings.values())
    .map((standing) => ({
      ...standing,
      winPercentage:
        standing.played > 0
          ? (standing.wins / standing.played) * 100
          : 0,
    }))
    .sort(
      (a, b) =>
        b.winPercentage - a.winPercentage ||
        b.wins - a.wins ||
        a.losses - b.losses ||
        a.team.localeCompare(b.team),
    );
}



// import { Schedules, StandingData } from "@/src/types/types";

// export function transformTeamsData(
//   games: Schedules[],
//   sportId?: number,
// ): StandingData[] {
//   const leaderboard: Record<
//     string,
//     { team: string; wins: number; losses: number; sport: string }
//   > = {};

//   // Filter by sport if specified
//   const filteredGames =
//     sportId !== undefined
//       ? games.filter((g) => g.gameType.id === sportId)
//       : games;

//   for (const g of filteredGames) {
//     const sport = g.gameType.gameName;
//     const teamA = g.teamA.teamName;
//     const teamB = g.teamB.teamName;

//     // Skip if team names are missing
//     if (!teamA || !teamB) continue;

//     // Initialize Team A entry if it doesn't exist
//     if (!leaderboard[teamA]) {
//       leaderboard[teamA] = {
//         team: teamA,
//         wins: 0,
//         losses: 0,
//         sport: sportId !== undefined ? sport : "Overall",
//       };
//     }

//     // Initialize Team B entry if it doesn't exist
//     if (!leaderboard[teamB]) {
//       leaderboard[teamB] = {
//         team: teamB,
//         wins: 0,
//         losses: 0,
//         sport: sportId !== undefined ? sport : "Overall",
//       };
//     }

//     // Handle both teams forfeiting - both get a loss
//     if (g.teamAForfeited && g.teamBForfeited) {
//       leaderboard[teamA].losses++;
//       leaderboard[teamB].losses++;
//       continue;
//     }

//     // Skip draws - no wins or losses for either team
//     if (g.isDraw) {
//       continue;
//     }

//     // Skip if no winner is declared and no forfeits
//     if (!g.winnerId) continue;

//     const winnerTeam =
//       g.winnerId === g.teamA.id
//         ? teamA
//         : g.winnerId === g.teamB.id
//           ? teamB
//           : null;

//     if (!winnerTeam) continue;

//     // Update wins/losses
//     if (winnerTeam === teamA) {
//       leaderboard[teamA].wins++;
//       leaderboard[teamB].losses++;
//     } else {
//       leaderboard[teamB].wins++;
//       leaderboard[teamA].losses++;
//     }
//   }

//   return Object.values(leaderboard)
//     .map((entry, idx) => {
//       const totalGames = entry.wins + entry.losses;
//       return {
//         id: idx + 1,
//         team: entry.team,
//         wins: entry.wins,
//         losses: entry.losses,
//         winPercentage: totalGames > 0 ? (entry.wins / totalGames) * 100 : 0,
//         sport: entry.sport,
//       };
//     })
//     .sort((a, b) => b.winPercentage - a.winPercentage);
// }
