import type { GameParticipantWithTeam, Schedules } from "@/src/types/types";

export function isMultiTeam(game: Pick<Schedules, "gameType">): boolean {
  return game.gameType.format === "MULTI_TEAM";
}

/** Each competing team once, in entry order. */
export function participatingTeams(game: Pick<Schedules, "participants">): GameParticipantWithTeam["team"][] {
  const teams = new Map<number, GameParticipantWithTeam["team"]>();
  for (const { team } of game.participants) if (!teams.has(team.id)) teams.set(team.id, team);
  return [...teams.values()];
}

/** The athlete's name when entered, otherwise the team name. */
export function entryName(entry: Pick<GameParticipantWithTeam, "name" | "team">): string {
  return entry.name ?? entry.team.teamName;
}

/**
 * Labels for the admin placings form: "Bartolini, Clissiah Belle — SOE" for a named entry.
 * A team's unnamed entries are numbered ("SOE (1)", "SOE (2)") when it has more than one,
 * so their rank boxes can be told apart.
 */
export function entryLabels(game: Pick<Schedules, "participants">): Map<number, string> {
  const unnamed = [...game.participants].filter((p) => p.name == null).sort((a, b) => a.id - b.id);
  const unnamedPerTeam = new Map<number, number>();
  for (const { teamId } of unnamed) unnamedPerTeam.set(teamId, (unnamedPerTeam.get(teamId) ?? 0) + 1);

  const labels = new Map<number, string>();
  const seen = new Map<number, number>();
  for (const { id, teamId, team } of unnamed) {
    const n = (seen.get(teamId) ?? 0) + 1;
    seen.set(teamId, n);
    labels.set(id, (unnamedPerTeam.get(teamId) ?? 0) > 1 ? `${team.teamName} (${n})` : team.teamName);
  }
  for (const { id, name, team } of game.participants) {
    if (name != null) labels.set(id, `${name} — ${team.teamName}`);
  }
  return labels;
}

/** 1 → "1st", 2 → "2nd", 11 → "11th", 22 → "22nd". */
export function ordinal(rank: number): string {
  const tens = rank % 100;
  if (tens >= 11 && tens <= 13) return `${rank}th`;
  return `${rank}${ORDINAL_SUFFIXES[rank % 10] ?? "th"}`;
}

const ORDINAL_SUFFIXES: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

/** Ranked entries first by rank, then unranked ones, each group by team and then name. */
export function sortedParticipants(game: Pick<Schedules, "participants">): GameParticipantWithTeam[] {
  return [...game.participants].sort((a, b) => {
    if (a.rank != null && b.rank != null && a.rank !== b.rank) return a.rank - b.rank;
    if (a.rank == null && b.rank != null) return 1;
    if (a.rank != null && b.rank == null) return -1;
    return a.team.teamName.localeCompare(b.team.teamName) || entryName(a).localeCompare(entryName(b));
  });
}
