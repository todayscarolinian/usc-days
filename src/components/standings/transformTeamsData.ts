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
