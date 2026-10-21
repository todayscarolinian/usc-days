import { prisma } from "@/src/lib/prisma";
import { ApiError } from "@/src/lib/api";
import { summarizeSets, summarizeFinalSets } from "@/src/lib/set-scoring";
import { GAME_INCLUDE } from "./games.service";
import { SCORES_REQUIRE_TEAMS_MESSAGE, type SetActionPayload } from "@/src/types/games.types";

/** All set writes lock the match first; version checks reject stale scorer/dialog submissions. */
export async function updateSets(id: number, action: SetActionPayload) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM games WHERE id = ${id} FOR UPDATE`;
    const game = await tx.game.findUnique({ where: { id }, include: GAME_INCLUDE });
    if (!game) throw new ApiError("NOT_FOUND", "Game not found.");
    if (game.gameType.scoringMode !== "SETS" || game.gameType.format !== "HEAD_TO_HEAD") {
      throw new ApiError("VALIDATION_ERROR", "Only set-based matches have set scores.");
    }
    if (game.teamAId == null || game.teamBId == null) {
      throw new ApiError("VALIDATION_ERROR", SCORES_REQUIRE_TEAMS_MESSAGE);
    }
    if (action.scoringVersion !== game.scoringVersion) {
      throw new ApiError("CONFLICT", "Scores changed. Refresh the match and try again.");
    }
    const bestOf = game.bestOf ?? 3;
    let sets = game.sets.map(s => ({ ...s }));
    let teamAForfeited = game.teamAForfeited;
    let teamBForfeited = game.teamBForfeited;
    if (action.action === "replace" || action.action === "final") {
      teamAForfeited = action.teamAForfeited;
      teamBForfeited = action.teamBForfeited;
      sets = action.action === "replace" ? action.sets.map(s => ({ ...s, id: 0, gameId: id })) : [];
    } else {
      if (game.winnerId != null || game.isDraw || teamAForfeited || teamBForfeited) {
        throw new ApiError("CONFLICT", "This match has a result. Use Edit result to correct it.");
      }
      if (game.sets.length === 0 && (game.teamAScore != null || game.teamBScore != null)) {
        throw new ApiError("CONFLICT", "This match has totals without set details. Edit its result or clear it before live scoring.");
      }
      const active = sets.find(s => s.status === "IN_PROGRESS");
      if (action.action === "start") {
        if (active) throw new ApiError("CONFLICT", "A set is already in progress.");
        sets.push({ id: 0, gameId: id, setNumber: sets.length + 1, teamAPoints: 0, teamBPoints: 0, status: "IN_PROGRESS" });
      } else {
        if (!active || active.id !== action.setId) {
          throw new ApiError("CONFLICT", "This set is no longer active. Refresh the match.");
        }
        if (action.action === "complete") active.status = "COMPLETED";
        else {
          const field = action.team === "A" ? "teamAPoints" : "teamBPoints";
          active[field] += action.delta;
        }
      }
    }
    let summary;
    try {
      summary = action.action === "final"
        ? summarizeFinalSets(bestOf, action.teamAScore, action.teamBScore, teamAForfeited || teamBForfeited)
        : summarizeSets(bestOf, sets);
    } catch (error) {
      throw new ApiError("VALIDATION_ERROR", error instanceof Error ? error.message : "Invalid set scores.");
    }
    const winnerId = teamAForfeited || teamBForfeited
      ? teamAForfeited && teamBForfeited ? null : teamAForfeited ? game.teamBId : game.teamAId
      : summary.winner === "A" ? game.teamAId : summary.winner === "B" ? game.teamBId : null;

    if (action.action === "replace" || action.action === "final") {
      await tx.gameSet.deleteMany({ where: { gameId: id } });
      if (sets.length) await tx.gameSet.createMany({ data: sets.map(s => ({
        gameId: id, setNumber: s.setNumber, teamAPoints: s.teamAPoints, teamBPoints: s.teamBPoints, status: s.status,
      })) });
    } else if (action.action === "start") {
      const next = sets[sets.length - 1];
      await tx.gameSet.create({ data: { gameId: id, setNumber: next.setNumber } });
    } else {
      const changed = sets.find(s => s.id === action.setId)!;
      await tx.gameSet.update({ where: { id: changed.id }, data: {
        teamAPoints: changed.teamAPoints, teamBPoints: changed.teamBPoints, status: changed.status,
      } });
    }
    return tx.game.update({
      where: { id },
      data: {
        teamAScore: action.action === "final" || sets.length || teamAForfeited || teamBForfeited ? summary.a : null,
        teamBScore: action.action === "final" || sets.length || teamAForfeited || teamBForfeited ? summary.b : null,
        winnerId, teamAForfeited, teamBForfeited, isDraw: false,
        scoringVersion: { increment: 1 },
      },
      include: GAME_INCLUDE,
    });
  });
}
