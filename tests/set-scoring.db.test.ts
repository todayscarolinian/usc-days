import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/src/lib/prisma";
import GameService from "@/src/services/games.service";
import { updateSets } from "@/src/services/set-scoring.service";
import type { SetScore } from "@/src/lib/set-scoring";

const url = process.env.POSTGRES_DB_URL ?? "";
const local = url.includes("127.0.0.1") || url.includes("localhost");

describe.skipIf(!local)("set scoring against local database", () => {
  const games = new GameService();
  const gameIds: number[] = [];
  let schoolId: number;
  let sportId: number;
  let linearId: number;
  let aId: number;
  let bId: number;
  const won = (setNumber: number, a = 25, b = 20): SetScore => ({
    setNumber, teamAPoints: a, teamBPoints: b, status: "COMPLETED",
  });
  beforeAll(async () => {
    const school = await prisma.school.create({ data: { schoolName: `Set scoring test ${Date.now()}`, teams: {
      create: [{ teamName: "Set test A" }, { teamName: "Set test B" }],
    } }, include: { teams: true } });
    schoolId = school.id;
    [aId, bId] = school.teams.map(t => t.id);
    sportId = (await prisma.gameType.create({ data: { gameName: "Set test volleyball", scoringMode: "SETS" } })).id;
    linearId = (await prisma.gameType.create({ data: { gameName: "Set test basketball" } })).id;
  });
  afterAll(async () => {
    await prisma.game.deleteMany({ where: { id: { in: gameIds } } });
    await prisma.team.deleteMany({ where: { schoolId } });
    await prisma.school.delete({ where: { id: schoolId } });
    await prisma.gameType.deleteMany({ where: { id: { in: [sportId, linearId] } } });
  });
  async function create(bestOf: 3 | 5 = 3, gameTypeId = sportId) {
    const date = new Date(Date.UTC(2036, 0, 1 + gameIds.length));
    const game = await games.addGame({
      gameTypeId, teamAId: aId, teamBId: bId, bestOf: gameTypeId === sportId ? bestOf : null,
      startDate: date.toISOString(), endDate: new Date(+date + 3600000).toISOString(),
    }, "set-scoring-test");
    gameIds.push(game.id);
    return games.getGameById(game.id);
  }
  async function replace(id: number, sets: SetScore[], version = 0, aForfeit = false, bForfeit = false) {
    return updateSets(id, { action: "replace", scoringVersion: version, sets,
      teamAForfeited: aForfeit, teamBForfeited: bForfeit });
  }

  it("scores points, completes sets, derives the match winner, and rejects late clicks", async () => {
    const game = await create();
    let next = await updateSets(game.id, { action: "start", scoringVersion: 0 });
    expect(Number(next.teamAScore)).toBe(0);
    next = await updateSets(game.id, { action: "point", scoringVersion: 1, setId: next.sets[0].id, team: "A", delta: 1 });
    expect(next.sets[0].teamAPoints).toBe(1);
    expect(Number(next.teamAScore)).toBe(0);
    await expect(updateSets(game.id, { action: "complete", scoringVersion: 2, setId: next.sets[0].id })).rejects.toThrow("Set 1");
    next = await replace(game.id, [won(1), { ...won(2, 26, 24), status: "IN_PROGRESS" }], 2);
    const setId = next.sets[1].id;
    next = await updateSets(game.id, { action: "complete", scoringVersion: 3, setId });
    expect(Number(next.teamAScore)).toBe(2);
    expect(next.winnerId).toBe(aId);
    await expect(updateSets(game.id, { action: "start", scoringVersion: 4 })).rejects.toThrow("has a result");
    await expect(updateSets(game.id, { action: "point", scoringVersion: 4, setId, team: "A", delta: 1 })).rejects.toThrow("has a result");
  });

  it("keeps a third non-placement set at 25 and handles placement fifth-set deuces", async () => {
    const short = await create();
    await expect(replace(short.id, [won(1), won(2, 20, 25), won(3, 15, 10)])).rejects.toThrow("Set 3");
    expect((await replace(short.id, [won(1), won(2, 20, 25), won(3, 27, 25)])).winnerId).toBe(aId);
    const long = await create(5);
    expect(long.bestOf).toBe(5);
    const split = [won(1), won(2, 20, 25), won(3), won(4, 20, 25)];
    await expect(replace(long.id, [...split, won(5, 15, 14)])).rejects.toThrow("Set 5");
    const result = await replace(long.id, [...split, won(5, 16, 18)]);
    expect(Number(result.teamAScore)).toBe(2);
    expect(Number(result.teamBScore)).toBe(3);
    expect(result.winnerId).toBe(bId);
  });

  it("serializes simultaneous submissions and rejects stale corrections", async () => {
    const game = await create();
    const results = await Promise.allSettled([
      updateSets(game.id, { action: "start", scoringVersion: 0 }),
      updateSets(game.id, { action: "start", scoringVersion: 0 }),
    ]);
    expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
    expect(results.filter(r => r.status === "rejected")).toHaveLength(1);
    const next = await games.getGameById(game.id);
    expect(next.sets).toHaveLength(1);
    await expect(replace(game.id, [won(1)], 0)).rejects.toThrow("Scores changed");
    await expect(updateSets(game.id, { action: "point", scoringVersion: 1, setId: next.sets[0].id, team: "A", delta: -1 })).rejects.toThrow("non-negative");
  });

  it("rejects delayed points aimed at a completed set", async () => {
    const game = await create();
    let next = await replace(game.id, [won(1)]);
    const oldId = next.sets[0].id;
    next = await updateSets(game.id, { action: "start", scoringVersion: 1 });
    await expect(updateSets(game.id, { action: "point", scoringVersion: 2, setId: oldId, team: "A", delta: 1 })).rejects.toThrow("no longer active");
    expect(next.sets[1].teamAPoints).toBe(0);
  });

  it("applies quick and custom point deltas only to the active set", async () => {
    const game = await create();
    let next = await updateSets(game.id, { action: "start", scoringVersion: 0 });
    const setId = next.sets[0].id;
    let points = 0;
    for (const delta of [1, 2, 3, 17, -3, -2, -1]) {
      points += delta;
      next = await updateSets(game.id, { action: "point", scoringVersion: next.scoringVersion, setId, team: "A", delta });
      expect(next.sets[0].teamAPoints).toBe(points);
      expect(Number(next.teamAScore)).toBe(0);
      expect(next.winnerId).toBe(null);
    }
    await expect(updateSets(game.id, { action: "point", scoringVersion: next.scoringVersion, setId, team: "A", delta: -points - 1 })).rejects.toThrow("non-negative");
    expect((await games.getGameById(game.id)).sets[0].teamAPoints).toBe(points);
    next = await updateSets(game.id, { action: "point", scoringVersion: next.scoringVersion, setId, team: "A", delta: 25 - points });
    next = await updateSets(game.id, { action: "complete", scoringVersion: next.scoringVersion, setId });
    expect(Number(next.teamAScore)).toBe(1);
    next = await updateSets(game.id, { action: "start", scoringVersion: next.scoringVersion });
    await expect(updateSets(game.id, { action: "point", scoringVersion: next.scoringVersion, setId, team: "A", delta: 17 })).rejects.toThrow("no longer active");
    expect(next.sets[1].teamAPoints).toBe(0);
  });

  it("recalculates corrections, preserves played points on forfeit, and clears results", async () => {
    const game = await create();
    let next = await replace(game.id, [won(1), won(2)]);
    expect(next.winnerId).toBe(aId);
    next = await replace(game.id, [won(1), won(2, 20, 25)], 1);
    expect(next.winnerId).toBe(null);
    expect(Number(next.teamAScore)).toBe(1);
    next = await replace(game.id, [won(1), won(2, 20, 25)], 2, true);
    expect(next.winnerId).toBe(bId);
    expect(next.sets).toHaveLength(2);
    next = await replace(game.id, [], 3, true, true);
    expect(next.winnerId).toBe(null);
    expect(next.teamAForfeited && next.teamBForfeited).toBe(true);
    next = await replace(game.id, [], 4);
    expect(next.teamAScore).toBe(null);
    expect(next.teamAForfeited).toBe(false);
    expect(next.sets).toHaveLength(0);
  });

  it("protects format and teams after scoring, and blocks the linear score API", async () => {
    const game = await create();
    await updateSets(game.id, { action: "start", scoringVersion: 0 });
    const payload = { gameTypeId: sportId, teamAId: aId, teamBId: bId,
      startDate: game.startDate.toISOString(), endDate: game.endDate.toISOString() };
    await expect(games.editGame(game.id, { ...payload, bestOf: 5 })).rejects.toThrow("Clear the volleyball result");
    await expect(games.editGame(game.id, { ...payload, teamAId: bId, teamBId: aId })).rejects.toThrow("Clear the volleyball result");
    await expect(games.updateScore(game.id, { team: "A", delta: 1 })).rejects.toThrow("active set");
    await expect(games.editGame(game.id, { ...payload, teamAScore: 2, winnerId: aId })).rejects.toThrow("Use set scoring");
    await games.editGame(game.id, { ...payload, location: "Updated court" });
    expect((await games.getGameById(game.id)).location).toBe("Updated court");
    await replace(game.id, [], 1);
    await games.editGame(game.id, { ...payload, bestOf: 5 });
    expect((await games.getGameById(game.id)).bestOf).toBe(5);
  });

  it("preserves legacy scores until corrected and leaves linear sports working", async () => {
    const game = await create();
    await prisma.game.update({ where: { id: game.id }, data: { teamAScore: 2, teamBScore: 1, winnerId: aId } });
    expect((await games.getGameById(game.id)).sets).toHaveLength(0);
    const corrected = await replace(game.id, [won(1), won(2, 20, 25), won(3)]);
    expect(corrected.winnerId).toBe(aId);
    const linear = await create(3, linearId);
    expect(linear.bestOf).toBe(null);
    await expect(updateSets(linear.id, { action: "start", scoringVersion: 0 })).rejects.toThrow("Only set-based");
    expect(Number((await games.updateScore(linear.id, { team: "A", delta: 3 })).teamAScore)).toBe(3);
  });

  it("invalidates an open result editor when teams change before scoring starts", async () => {
    const game = await create();
    await games.editGame(game.id, { gameTypeId: sportId, teamAId: bId, teamBId: aId,
      startDate: game.startDate.toISOString(), endDate: game.endDate.toISOString() });
    await expect(replace(game.id, [won(1)], 0)).rejects.toThrow("Scores changed");
  });

  it("deletes set records with their match", async () => {
    const game = await create();
    await replace(game.id, [won(1)]);
    await games.deleteGame(game.id);
    expect(await prisma.gameSet.count({ where: { gameId: game.id } })).toBe(0);
  });

  it("saves and corrects final totals without creating fictional set records", async () => {
    const game = await create(5);
    const action = { action: "final" as const, scoringVersion: 0, teamAScore: 3, teamBScore: 0,
      teamAForfeited: false, teamBForfeited: false };
    let result = await updateSets(game.id, action);
    expect(Number(result.teamAScore)).toBe(3);
    expect(Number(result.teamBScore)).toBe(0);
    expect(result.winnerId).toBe(aId);
    expect(result.sets).toEqual([]);
    await expect(updateSets(game.id, { action: "start", scoringVersion: 1 })).rejects.toThrow("has a result");
    await expect(updateSets(game.id, action)).rejects.toThrow("Scores changed");
    result = await updateSets(game.id, { ...action, scoringVersion: 1, teamAScore: 2, teamBScore: 3 });
    expect(result.winnerId).toBe(bId);
    expect(result.sets).toEqual([]);
    await expect(games.editGame(game.id, { gameTypeId: sportId, teamAId: aId, teamBId: bId,
      startDate: game.startDate.toISOString(), endDate: game.endDate.toISOString(), bestOf: 3 })).rejects.toThrow("Clear the volleyball result");
  });

  it("requires valid final totals for each format and leaves invalid submissions unchanged", async () => {
    for (const bestOf of [3, 5] as const) {
      const game = await create(bestOf);
      for (const [a, b] of bestOf === 3 ? [[1, 0], [2, 2], [3, 0]] : [[2, 0], [3, 3], [5, 2]]) {
        await expect(updateSets(game.id, { action: "final", scoringVersion: 0, teamAScore: a, teamBScore: b,
          teamAForfeited: false, teamBForfeited: false })).rejects.toThrow();
      }
      expect((await games.getGameById(game.id)).winnerId).toBe(null);
      const result = await updateSets(game.id, { action: "final", scoringVersion: 0, teamAScore: bestOf === 3 ? 2 : 3, teamBScore: 1,
        teamAForfeited: false, teamBForfeited: false });
      expect(result.winnerId).toBe(aId);
      expect(result.sets).toEqual([]);
    }
  });

  it("can replace partial tracking with a final-only result and add a breakdown later", async () => {
    const game = await create(5);
    await replace(game.id, [won(1)]);
    let result = await updateSets(game.id, { action: "final", scoringVersion: 1, teamAScore: 3, teamBScore: 0,
      teamAForfeited: false, teamBForfeited: false });
    expect(result.sets).toEqual([]);
    expect(result.winnerId).toBe(aId);
    result = await replace(game.id, [won(1), won(2), won(3)], 2);
    expect(result.sets).toHaveLength(3);
    expect(result.winnerId).toBe(aId);
    result = await replace(game.id, [], 3);
    expect(result.teamAScore).toBe(null);
    expect(result.winnerId).toBe(null);
    expect((await updateSets(game.id, { action: "start", scoringVersion: 4 })).sets).toHaveLength(1);
  });

  it("supports final-only forfeits without inventing point scores", async () => {
    const game = await create(5);
    const result = await updateSets(game.id, { action: "final", scoringVersion: 0, teamAScore: 1, teamBScore: 0,
      teamAForfeited: true, teamBForfeited: false });
    expect(result.winnerId).toBe(bId);
    expect(result.sets).toEqual([]);
    expect(Number(result.teamAScore)).toBe(1);
  });
});
