import { describe, expect, it } from "vitest";
import { setTarget, validCompletedSet, summarizeSets, summarizeFinalSets, setScoreSummary, type SetScore } from "@/src/lib/set-scoring";
import { MAX_SCORE_DELTA, SetActionSchema } from "@/src/types/games.types";

const won = (setNumber: number, a = 25, b = 20): SetScore => ({
  setNumber, teamAPoints: a, teamBPoints: b, status: "COMPLETED",
});

describe("volleyball rules", () => {
  it("uses 25 for every non-placement set and 15 only for placement set five", () => {
    expect([1, 2, 3].map(n => setTarget(3, n))).toEqual([25, 25, 25]);
    expect([1, 2, 3, 4, 5].map(n => setTarget(5, n))).toEqual([25, 25, 25, 25, 15]);
  });

  it("requires deuce wins with no cap, and rejects scores beyond the first winning point", () => {
    for (const target of [15, 25]) {
      expect(validCompletedSet(target, 0, target)).toBe(true);
      expect(validCompletedSet(target, target - 1, target)).toBe(false);
      expect(validCompletedSet(target + 1, target - 1, target)).toBe(true);
      expect(validCompletedSet(51, 49, target)).toBe(true);
      expect(validCompletedSet(target + 2, target - 1, target)).toBe(false);
      expect(validCompletedSet(target - 1, 0, target)).toBe(false);
      expect(validCompletedSet(-1, target, target)).toBe(false);
      expect(validCompletedSet(target, 1.5, target)).toBe(false);
    }
  });

  it("ends best-of-three at two sets, including a 25-point third set", () => {
    expect(summarizeSets(3, [won(1), won(2)])).toEqual({ a: 2, b: 0, winner: "A" });
    expect(summarizeSets(3, [won(1), won(2, 20, 25), won(3, 26, 24)])).toEqual({ a: 2, b: 1, winner: "A" });
    expect(() => summarizeSets(3, [won(1), won(2, 20, 25), won(3, 15, 11)])).toThrow("Set 3");
    expect(() => summarizeSets(3, [won(1), won(2), won(3)])).toThrow("match-winning");
  });

  it("ends placement matches at three sets and validates fifth-set deuces", () => {
    const split = [won(1), won(2, 20, 25), won(3), won(4, 20, 25)];
    expect(summarizeSets(5, split)).toEqual({ a: 2, b: 2, winner: null });
    expect(summarizeSets(5, [...split, won(5, 18, 20)])).toEqual({ a: 2, b: 3, winner: "B" });
    expect(() => summarizeSets(5, [...split, won(5, 15, 14)])).toThrow("Set 5");
    expect(summarizeSets(5, [won(1), won(2), won(3)])).toEqual({ a: 3, b: 0, winner: "A" });
  });

  it("keeps in-progress points out of match totals and enforces ordered sets", () => {
    const active = { ...won(2, 25, 24), status: "IN_PROGRESS" as const };
    expect(summarizeSets(3, [won(1), active])).toEqual({ a: 1, b: 0, winner: null });
    expect(() => summarizeSets(5, [won(1), active, won(3)])).toThrow("Complete the current set");
    expect(() => summarizeSets(3, [won(2)])).toThrow("consecutive");
    expect(() => summarizeSets(3, [{ ...won(1), teamAPoints: -1 }])).toThrow("non-negative");
    expect(summarizeSets(3, [])).toEqual({ a: 0, b: 0, winner: null });
  });

  it("requires a version and specific set for point changes", () => {
    expect(SetActionSchema.safeParse({ action: "point", scoringVersion: 1, setId: 2, team: "A", delta: 1 }).success).toBe(true);
    for (const payload of [
      { action: "point", setId: 2, team: "A", delta: 1 },
      { action: "point", scoringVersion: 1, team: "A", delta: 1 },
      { action: "point", scoringVersion: 1, setId: 2, team: "A", delta: 0 },
      { action: "point", scoringVersion: 1, setId: 2, team: "A", delta: 1.5 },
      { action: "point", scoringVersion: 1, setId: 2, team: "A", delta: MAX_SCORE_DELTA + 1 },
      { action: "point", scoringVersion: 1, setId: 2, team: "A", delta: -MAX_SCORE_DELTA - 1 },
    ]) expect(SetActionSchema.safeParse(payload).success).toBe(false);
  });

  it("supports the old quick buttons and custom amounts for current-set points", () => {
    for (const delta of [1, 2, 3, -1, -2, -3, 17, -17, MAX_SCORE_DELTA, -MAX_SCORE_DELTA]) {
      expect(SetActionSchema.safeParse({ action: "point", scoringVersion: 1, setId: 2, team: "B", delta }).success).toBe(true);
    }
  });

  it("accepts final sets-won totals without any point breakdown", () => {
    for (const [bestOf, needed] of [[3, 2], [5, 3]]) {
      for (let loser = 0; loser < needed; loser++) {
        expect(summarizeFinalSets(bestOf, needed, loser)).toEqual({ a: needed, b: loser, winner: "A" });
        expect(summarizeFinalSets(bestOf, loser, needed)).toEqual({ a: loser, b: needed, winner: "B" });
      }
    }
    expect(setScoreSummary({ gameType: { scoringMode: "SETS" }, bestOf: 5, teamAScore: 3, teamBScore: 0, sets: [] }))
      .toBe("Sets · Per-set points not recorded");
  });

  it("rejects unfinished, drawn, or impossible final totals", () => {
    for (const [format, a, b] of [[3, 1, 0], [3, 2, 2], [3, 3, 0], [5, 2, 1], [5, 3, 3], [5, 5, 2], [5, 3, -1], [5, 3, 1.5]]) {
      expect(() => summarizeFinalSets(format, a, b)).toThrow();
    }
    expect(summarizeFinalSets(5, 1, 0, true)).toEqual({ a: 1, b: 0, winner: null });
  });
});
