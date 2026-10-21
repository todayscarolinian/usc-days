import { Schedules, StandingData } from "@/src/types/types";
import {
  comparePlacement,
  comparePlacings,
  entryPlacement,
  isMultiTeam,
  placingKey,
  type Placement,
} from "@/src/lib/multi-team";

export type TeamStandingData = StandingData & {
  played: number;
  /** An entry row's finish (see transformEntryStandings); null for team rows. */
  placement: Placement;
};

type MutableStanding = {
  id: number;
  team: string;
  wins: number;
  losses: number;
  draws: number;
  played: number;
  sport: string;
  firsts: number;
  seconds: number;
  thirds: number;
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
      draws: 0,
      played: 0,
      sport: sportId !== undefined ? sport : "Overall",
      firsts: 0,
      seconds: 0,
      thirds: 0,
    };

    standings.set(id, standing);
    return standing;
  }

  for (const game of filteredGames) {
    // Multi-team games add placings only; win/loss/draw stays head-to-head.
    if (isMultiTeam(game)) {
      for (const { rank, team } of game.participants) {
        const key = placingKey(rank);
        if (key) ensureTeam(team.id, team.teamName, game.gameType.gameName)[key]++;
      }
      continue;
    }

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
      teamA.draws++;
      teamB.draws++;
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
      placement: null,
      winPercentage:
        standing.played > 0
          ? (standing.wins / standing.played) * 100
          : 0,
    }))
    .sort(
      (a, b) =>
        b.winPercentage - a.winPercentage ||
        b.wins - a.wins ||
        comparePlacings(a, b) ||
        a.losses - b.losses ||
        a.team.localeCompare(b.team),
    );
}

/**
 * Standings for one multi-team sport: a row per entry, so a team that took 1st and 2nd
 * appears twice. Ordered by finish, with DNF and unranked entries last.
 */
export function transformEntryStandings(games: Schedules[], sportId: number): TeamStandingData[] {
  return games
    .filter((game) => game.gameType.id === sportId && isMultiTeam(game))
    .flatMap((game) => {
      const hasResults = game.participants.some((p) => p.rank != null);
      return game.participants.map(({ id, rank, team }) => {
        const key = placingKey(rank);
        return {
          id,
          team: team.teamName,
          wins: 0,
          losses: 0,
          draws: 0,
          played: 0,
          winPercentage: 0,
          sport: game.gameType.gameName,
          firsts: key === "firsts" ? 1 : 0,
          seconds: key === "seconds" ? 1 : 0,
          thirds: key === "thirds" ? 1 : 0,
          placement: entryPlacement(rank, hasResults),
        };
      });
    })
    .sort((a, b) => comparePlacement(a.placement, b.placement) || a.team.localeCompare(b.team));
}
