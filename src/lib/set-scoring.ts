export type SetScore = {
  setNumber: number;
  teamAPoints: number;
  teamBPoints: number;
  status: "IN_PROGRESS" | "COMPLETED";
};

export function isSetScoring(game: { gameType: { scoringMode?: string } }) {
  return game.gameType.scoringMode === "SETS";
}

export function setTarget(bestOf: number, setNumber: number) {
  return bestOf === 5 && setNumber === 5 ? 15 : 25;
}

/** A final score must also be reachable: play stops at the first two-point lead. */
export function validCompletedSet(a: number, b: number, target: number) {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 0 || b < 0) return false;
  const high = Math.max(a, b);
  const low = Math.min(a, b);
  return high >= target && high - low >= 2 && (high === target || high - low === 2);
}

/** Shared by live transitions and manual result entry. Throws a readable validation error. */
export function summarizeSets(bestOf: number, sets: readonly SetScore[]) {
  if (bestOf !== 3 && bestOf !== 5) throw new Error("Choose best of 3 or best of 5.");
  const needed = Math.floor(bestOf / 2) + 1;
  let a = 0;
  let b = 0;
  if (sets.length > bestOf) throw new Error(`This match allows at most ${bestOf} sets.`);
  sets.forEach((set, index) => {
    if (set.setNumber !== index + 1) throw new Error("Sets must be consecutive, starting at set 1.");
    if (a === needed || b === needed) throw new Error("No sets can follow a match-winning set.");
    if (!Number.isSafeInteger(set.teamAPoints) || !Number.isSafeInteger(set.teamBPoints) ||
        set.teamAPoints < 0 || set.teamBPoints < 0) {
      throw new Error("Set points must be non-negative whole numbers.");
    }
    if (set.status === "IN_PROGRESS") {
      if (index !== sets.length - 1) throw new Error("Complete the current set before starting another.");
    } else if (set.status === "COMPLETED") {
      const target = setTarget(bestOf, set.setNumber);
      if (!validCompletedSet(set.teamAPoints, set.teamBPoints, target)) {
        throw new Error(`Set ${set.setNumber} must finish at ${target} or more points, winning by two; play stops when won.`);
      }
      if (set.teamAPoints > set.teamBPoints) a++; else b++;
    } else {
      throw new Error("Invalid set status.");
    }
  });
  return { a, b, winner: a === needed ? "A" as const : b === needed ? "B" as const : null };
}

/** Final sets-won totals need no point-by-point breakdown. Forfeits may end early. */
export function summarizeFinalSets(bestOf: number, a: number, b: number, forfeited = false) {
  if (bestOf !== 3 && bestOf !== 5) throw new Error("Choose best of 3 or best of 5.");
  const needed = Math.floor(bestOf / 2) + 1;
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 ||
      a > needed || b > needed || (a === needed && b === needed)) {
    throw new Error(`Invalid final score for best of ${bestOf}. Sets won must be whole numbers from 0 to ${needed}, with only one winner.`);
  }
  if (!forfeited && Math.max(a, b) !== needed) {
    throw new Error(`A best-of-${bestOf} final needs one team to win ${needed} sets.`);
  }
  return { a, b, winner: a === needed ? "A" as const : b === needed ? "B" as const : null };
}

export function setScoreSummary(game: {
  bestOf?: number | null;
  sets?: readonly SetScore[];
  gameType: { scoringMode?: string };
  teamAScore?: unknown;
  teamBScore?: unknown;
}) {
  if (!isSetScoring(game)) return null;
  const sets = game.sets ?? [];
  if (sets.length === 0) return game.teamAScore != null || game.teamBScore != null
    ? "Sets · Per-set points not recorded"
    : `Best of ${game.bestOf ?? 3} · First to ${game.bestOf === 5 ? 3 : 2} sets`;
  return `Sets · ${sets.map(s => `S${s.setNumber}: ${s.teamAPoints}–${s.teamBPoints}${s.status === "IN_PROGRESS" ? " (in progress)" : ""}`).join(" · ")}`;
}
