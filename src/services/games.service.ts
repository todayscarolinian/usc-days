import { prisma } from "@/src/lib/prisma";
import {
  AddGamePayload,
  EditGamePayload,
  ScoreDeltaPayload,
  MultiTeamResultPayload,
  PaginationParams,
  PaginatedGamesResponse,
  SCORES_REQUIRE_TEAMS_MESSAGE,
  MULTI_TEAM_HAS_NO_AB_MESSAGE,
  hasSavedResult,
} from "@/src/types/games.types";
import { ApiError } from "@/src/lib/api";
import { decodeGamesCursor, encodeGamesCursor } from "@/src/lib/games-cursor";
import { Prisma } from "@/src/lib/prisma/generated/client";

export type StoredGameTeams = {
  teamAId: number | null;
  teamBId: number | null;
  teamAScore: unknown;
  teamBScore: unknown;
  winnerId: number | null;
  teamAForfeited: boolean;
  teamBForfeited: boolean;
  isDraw: boolean;
};

export type GameTeamEdit = {
  teamAId: number | null;
  teamBId: number | null;
  teamAScore?: unknown;
  teamBScore?: unknown;
  winnerId?: number | null;
  teamAForfeited?: boolean;
  teamBForfeited?: boolean;
  isDraw?: boolean;
};

/** Team ids come from the edit. Omitted result fields keep the stored value. */
export function resolveEditedGame(
  existing: StoredGameTeams,
  edit: GameTeamEdit,
): StoredGameTeams {
  return {
    teamAId: edit.teamAId,
    teamBId: edit.teamBId,
    teamAScore:
      edit.teamAScore !== undefined ? edit.teamAScore : existing.teamAScore,
    teamBScore:
      edit.teamBScore !== undefined ? edit.teamBScore : existing.teamBScore,
    winnerId: edit.winnerId !== undefined ? edit.winnerId : existing.winnerId,
    teamAForfeited:
      edit.teamAForfeited !== undefined
        ? edit.teamAForfeited
        : existing.teamAForfeited,
    teamBForfeited:
      edit.teamBForfeited !== undefined
        ? edit.teamBForfeited
        : existing.teamBForfeited,
    isDraw: edit.isDraw !== undefined ? edit.isDraw : existing.isDraw,
  };
}

export function assertTeamsSetForResults(state: StoredGameTeams) {
  if (
    hasSavedResult(state) &&
    (state.teamAId == null || state.teamBId == null)
  ) {
    throw new ApiError("VALIDATION_ERROR", SCORES_REQUIRE_TEAMS_MESSAGE);
  }
}

/** Duplicate-matchup lookup applies only when both teams are already known. */
export function duplicateTeamMatchupFilter(
  gameTypeId: number,
  teamAId: number | null | undefined,
  teamBId: number | null | undefined,
): Prisma.GameWhereInput | null {
  if (teamAId == null || teamBId == null) return null;

  return {
    gameTypeId,
    OR: [
      { AND: [{ teamAId }, { teamBId }] },
      { AND: [{ teamAId: teamBId }, { teamBId: teamAId }] },
    ],
  };
}

/** A game without a winner, draw, or forfeit can still have its score changed. */
const UNFINISHED_GAME: Prisma.GameWhereInput = {
  winnerId: null,
  isDraw: false,
  teamAForfeited: false,
  teamBForfeited: false,
};

export const FINISHED_GAME_SCORE_MESSAGE =
  "This game already has a result. Edit its score from the Add Score dialog.";
export const NEGATIVE_SCORE_MESSAGE = "Scores cannot go below 0.";
export const MULTI_TEAM_NOT_SCORED_MESSAGE =
  "Multi-team games are ranked, not scored.";
export const PARTICIPANTS_REQUIRE_MULTI_TEAM_MESSAGE =
  "Only multi-team sports list participants.";
export const FORMAT_CHANGE_MESSAGE =
  "A game cannot move between a head-to-head and a multi-team sport.";
export const RANKED_PARTICIPANTS_MESSAGE =
  "Clear this game's results before changing its teams.";
export const RESULTS_MUST_MATCH_PARTICIPANTS_MESSAGE =
  "Results must list every participating team exactly once.";

const GAME_INCLUDE = {
  gameType: true,
  teamA: { include: { school: true } },
  teamB: { include: { school: true } },
  winner: true,
  participants: {
    include: { team: { include: { school: true } } },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.GameInclude;

/** True when the participant list is unchanged, ignoring order. */
export function sameTeamSet(a: readonly number[], b: readonly number[]) {
  const set = new Set(a);
  return set.size === new Set(b).size && b.every((id) => set.has(id));
}

async function getSportFormat(gameTypeId: number) {
  const sport = await prisma.gameType.findUnique({
    where: { id: gameTypeId },
    select: { format: true },
  });
  if (!sport) {
    throw new ApiError("NOT_FOUND", "Sport not found.");
  }
  return sport.format;
}

/** Every participant must be registered for the sport. */
async function assertTeamsInSport(gameTypeId: number, teamIds: number[]) {
  const registered = await prisma.teamGameType.findMany({
    where: { gameTypeId, teamId: { in: teamIds } },
    select: { teamId: true },
  });
  const registeredIds = new Set(registered.map((row) => row.teamId));
  if (teamIds.some((id) => !registeredIds.has(id))) {
    throw new ApiError(
      "VALIDATION_ERROR",
      "Every participating team must be registered for this sport.",
    );
  }
}

export interface GetGamesParams {
  gameTypeId?: number;
  gameTypeIds?: number[];
  teamAId?: number;
  teamBId?: number;
  teamId?: number; // matches teamA, teamB, or a multi-team participant
  winnerId?: number;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  /** Games that start at or after this instant. Unlike `startDate`, ignores overlap. */
  startsFrom?: Date;
  /** Games that start before this instant. Unlike `endDate`, ignores overlap. */
  startsBefore?: Date;
  hasWinner?: boolean;
  createdByHeraldId?: string;
}

export interface GetGamesWithPaginationParams
  extends GetGamesParams, PaginationParams {}

class GameService {
  /**
   * Fetch games with optional cursor-based pagination.
   * Always returns `{ data, hasMore, nextCursor }`; without `cursor`/`limit`
   * every matching game is returned and `hasMore` is false.
   */
  async getGames(
    params?: GetGamesWithPaginationParams,
  ): Promise<PaginatedGamesResponse> {
    const where: Prisma.GameWhereInput = {};
    const and: Prisma.GameWhereInput[] = [];
    const cursor = params?.cursor;
    const limit = params?.limit;
    const order = params?.order ?? "asc";

    if (params?.gameTypeId) {
      where.gameTypeId = params.gameTypeId;
    }

    if (params?.gameTypeIds) {
      and.push({ gameTypeId: { in: params.gameTypeIds } });
    }

    if (params?.teamAId) {
      where.teamAId = params.teamAId;
    }

    if (params?.teamBId) {
      where.teamBId = params.teamBId;
    }

    if (params?.teamId) {
      where.OR = [
        { teamAId: params.teamId },
        { teamBId: params.teamId },
        { participants: { some: { teamId: params.teamId } } },
      ];
    }

    if (params?.winnerId !== undefined) {
      where.winnerId = params.winnerId;
    }

    if (params?.location) {
      where.location = {
        contains: params.location,
        mode: "insensitive",
      };
    }

    if (params?.createdByHeraldId) {
      where.createdByHeraldId = params.createdByHeraldId;
    }

    if (params?.hasWinner !== undefined) {
      where.winnerId = params.hasWinner ? { not: null } : null;
    }

    if (params?.startDate || params?.endDate) {
      const dateConditions: Prisma.GameWhereInput[] = [];

      if (params.startDate && params.endDate) {
        dateConditions.push({
          AND: [
            { startDate: { lte: params.endDate } },
            { endDate: { gte: params.startDate } },
          ],
        });
      } else if (params.startDate) {
        dateConditions.push({ endDate: { gte: params.startDate } });
      } else if (params.endDate) {
        dateConditions.push({ startDate: { lte: params.endDate } });
      }

      and.push(...dateConditions);
    }

    if (params?.startsFrom) {
      and.push({ startDate: { gte: params.startsFrom } });
    }

    if (params?.startsBefore) {
      and.push({ startDate: { lt: params.startsBefore } });
    }

    if (cursor !== undefined || limit !== undefined) {
      const after = cursor ? decodeGamesCursor(cursor) : null;
      const pageSize = Math.min(limit || 20, 100);

      if (cursor && !after) {
        throw new ApiError("VALIDATION_ERROR", "Invalid cursor.");
      }

      // Games are ordered by (startDate, id), so the id breaks start-time ties.
      if (after) {
        and.push({
          OR: order === "asc"
            ? [
                { startDate: { gt: after.startDate } },
                { startDate: after.startDate, id: { gt: after.id } },
              ]
            : [
                { startDate: { lt: after.startDate } },
                { startDate: after.startDate, id: { lt: after.id } },
              ],
        });
      }

      if (and.length > 0) where.AND = and;

      const games = await prisma.game.findMany({
        where,
        include: GAME_INCLUDE,
        orderBy: [{ startDate: order }, { id: order }],
        take: pageSize + 1,
      });

      const hasMore = games.length > pageSize;
      const paginatedGames = games.slice(0, pageSize);
      const last = paginatedGames[paginatedGames.length - 1];
      const nextCursor = hasMore && last ? encodeGamesCursor(last) : null;

      return { data: paginatedGames, hasMore, nextCursor };
    }

    if (and.length > 0) where.AND = and;

    // No pagination: return all games
    const games = await prisma.game.findMany({
      where,
      include: GAME_INCLUDE,
      orderBy: [{ startDate: "asc" }, { createdAt: "asc" }],
    });

    return { data: games, hasMore: false, nextCursor: null };
  }
  async addGame(
    {
      gameTypeId,
      teamAId,
      teamBId,
      startDate,
      endDate,
      location,
      label,
      participantTeamIds,
    }: AddGamePayload,
    createdByHeraldId: string,
  ) {
    const format = await getSportFormat(gameTypeId);

    if (format === "MULTI_TEAM") {
      if (teamAId != null || teamBId != null) {
        throw new ApiError("VALIDATION_ERROR", MULTI_TEAM_HAS_NO_AB_MESSAGE);
      }
      if (participantTeamIds === undefined) {
        throw new ApiError(
          "VALIDATION_ERROR",
          "Please select at least two teams.",
        );
      }
      await assertTeamsInSport(gameTypeId, participantTeamIds);

      return prisma.game.create({
        data: {
          gameTypeId,
          startDate,
          endDate,
          location,
          label,
          createdByHeraldId,
          participants: {
            create: participantTeamIds.map((teamId) => ({ teamId })),
          },
        },
      });
    }

    if (participantTeamIds !== undefined) {
      throw new ApiError(
        "VALIDATION_ERROR",
        PARTICIPANTS_REQUIRE_MULTI_TEAM_MESSAGE,
      );
    }

    const proposedStart = new Date(startDate);
    const proposedEnd = new Date(endDate);
    const duplicateFilter = duplicateTeamMatchupFilter(
      gameTypeId,
      teamAId,
      teamBId,
    );
    const hasLocation = Boolean(location && location.trim() !== "");
    const conflictFilters: Prisma.GameWhereInput[] = [];

    if (duplicateFilter) conflictFilters.push(duplicateFilter);
    if (hasLocation && location) {
      conflictFilters.push({
        location: {
          equals: location,
          mode: "insensitive",
        },
      });
    }

    const conflicts =
      conflictFilters.length > 0
        ? await prisma.game.findMany({
            where: {
              AND: [
                { startDate: { lt: proposedEnd } },
                { endDate: { gt: proposedStart } },
              ],
              OR: conflictFilters,
            },
          })
        : [];

    // Same teams and sport, in either order. Skipped when either team is TBD.
    if (teamAId != null && teamBId != null) {
      const duplicate = conflicts.find(
        (game) =>
          game.gameTypeId === gameTypeId &&
          ((game.teamAId === teamAId && game.teamBId === teamBId) ||
            (game.teamAId === teamBId && game.teamBId === teamAId)),
      );
      if (duplicate) {
        throw new ApiError(
          "CONFLICT",
          "A schedule already exists for these teams at this time.",
        );
      }
    }

    // Check for location conflict (same venue can't host two games)
    /*
    if (location && location.trim() !== "") {
      const normalizedLocation = location.trim().toLowerCase();
      const locationConflict = conflicts.find(
        (game) => game.location?.trim().toLowerCase() === normalizedLocation,
      );
      if (locationConflict) {
        throw new ApiError(
          "CONFLICT",
          `The location "${location}" is already booked for another game during this time.`,
        );
      }
    }
    */

    // All validations passed, create the game
    const newGame = await prisma.game.create({
      data: {
        gameTypeId,
        teamAId: teamAId ?? null,
        teamBId: teamBId ?? null,
        startDate,
        endDate,
        location,
        label,
        createdByHeraldId,
      },
    });
    return newGame;
  }
  async editGame(
    id: number,
    {
      gameTypeId,
      teamAId,
      teamBId,
      teamAScore,
      teamBScore,
      winnerId,
      startDate,
      endDate,
      location,
      label,
      teamAForfeited,
      teamBForfeited,
      isDraw,
      participantTeamIds,
    }: EditGamePayload,
  ) {
    const existing = await prisma.game.findUnique({
      where: { id },
      include: {
        gameType: { select: { format: true } },
        participants: { select: { teamId: true, rank: true } },
      },
    });
    if (!existing) {
      throw new ApiError("NOT_FOUND", "Game not found.");
    }

    const format =
      gameTypeId === existing.gameTypeId
        ? existing.gameType.format
        : await getSportFormat(gameTypeId);
    if (format !== existing.gameType.format) {
      throw new ApiError("VALIDATION_ERROR", FORMAT_CHANGE_MESSAGE);
    }

    if (format === "MULTI_TEAM") {
      const editsAB =
        teamAId != null ||
        teamBId != null ||
        hasSavedResult({
          teamAScore,
          teamBScore,
          winnerId,
          teamAForfeited,
          teamBForfeited,
          isDraw,
        });
      if (editsAB) {
        throw new ApiError("VALIDATION_ERROR", MULTI_TEAM_HAS_NO_AB_MESSAGE);
      }

      const currentIds = existing.participants.map((p) => p.teamId);
      const nextIds = participantTeamIds ?? currentIds;
      const teamsChanged = !sameTeamSet(currentIds, nextIds);

      if (teamsChanged && existing.participants.some((p) => p.rank != null)) {
        throw new ApiError("CONFLICT", RANKED_PARTICIPANTS_MESSAGE);
      }
      if (teamsChanged || gameTypeId !== existing.gameTypeId) {
        await assertTeamsInSport(gameTypeId, nextIds);
      }

      const added = nextIds.filter((teamId) => !currentIds.includes(teamId));
      return prisma.game.update({
        where: { id },
        data: {
          gameTypeId,
          startDate,
          endDate,
          location,
          ...(label !== undefined ? { label } : {}),
          participants: {
            deleteMany: { teamId: { notIn: nextIds } },
            create: added.map((teamId) => ({ teamId })),
          },
        },
      });
    }

    if (participantTeamIds !== undefined) {
      throw new ApiError(
        "VALIDATION_ERROR",
        PARTICIPANTS_REQUIRE_MULTI_TEAM_MESSAGE,
      );
    }

    assertTeamsSetForResults(
      resolveEditedGame(existing, {
        teamAId,
        teamBId,
        teamAScore,
        teamBScore,
        winnerId,
        teamAForfeited,
        teamBForfeited,
        isDraw,
      }),
    );

    const bothForfeited = teamAForfeited && teamBForfeited;

    // Validate: Cannot be draw and forfeit
    if (isDraw && (teamAForfeited || teamBForfeited)) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "A game cannot be both a draw and have forfeits.",
      );
    }

    // Validate: Draw requires equal scores
    if (isDraw && teamAScore !== teamBScore) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "For a draw, both teams must have equal scores.",
      );
    }

    // Validate: Draw requires winnerId to be null
    if (isDraw && winnerId !== null && winnerId !== undefined) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "For a draw, winnerId must be null.",
      );
    }

    // Only validate winnerId for non-forfeit, non-draw games
    if (
      winnerId !== null &&
      winnerId !== undefined &&
      !bothForfeited &&
      !isDraw
    ) {
      const validTeam = await prisma.team.findUnique({
        where: { id: winnerId },
        select: { id: true },
      });

      if (!validTeam) {
        throw new ApiError(
          "VALIDATION_ERROR",
          "winnerId must be either teamAId, teamBId, or null for unfinished games.",
        );
      }

      if (winnerId !== teamAId && winnerId !== teamBId) {
        throw new ApiError(
          "VALIDATION_ERROR",
          "winnerId must be either teamAId, teamBId, or null for unfinished games.",
        );
      }
    }

    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        gameTypeId,
        teamAId,
        teamBId,
        teamAScore,
        teamBScore,
        ...(winnerId !== undefined ? { winnerId } : {}),
        startDate,
        endDate,
        location,
        ...(label !== undefined ? { label } : {}),
        ...(teamAForfeited !== undefined ? { teamAForfeited } : {}),
        ...(teamBForfeited !== undefined ? { teamBForfeited } : {}),
        ...(isDraw !== undefined ? { isDraw } : {}),
      },
    });
    return updatedGame;
  }
  /**
   * Adds `delta` to one team's score atomically, so concurrent scorers never lose points.
   * Empty scores start at 0 for both teams. Finished games and scores below 0 are rejected.
   */
  async updateScore(id: number, { team, delta }: ScoreDeltaPayload) {
    const field = team === "A" ? "teamAScore" : "teamBScore";

    return prisma.$transaction(async (tx) => {
      const existing = await tx.game.findUnique({
        where: { id },
        include: { gameType: { select: { format: true } } },
      });
      if (!existing) {
        throw new ApiError("NOT_FOUND", "Game not found.");
      }
      if (existing.gameType.format === "MULTI_TEAM") {
        throw new ApiError("VALIDATION_ERROR", MULTI_TEAM_NOT_SCORED_MESSAGE);
      }
      if (existing.teamAId == null || existing.teamBId == null) {
        throw new ApiError("VALIDATION_ERROR", SCORES_REQUIRE_TEAMS_MESSAGE);
      }

      await tx.game.updateMany({
        where: { id, teamAScore: null, ...UNFINISHED_GAME },
        data: { teamAScore: 0 },
      });
      await tx.game.updateMany({
        where: { id, teamBScore: null, ...UNFINISHED_GAME },
        data: { teamBScore: 0 },
      });

      // The conditions are checked in the same statement as the increment,
      // so a result saved meanwhile or a concurrent decrement cannot slip past them.
      const { count } = await tx.game.updateMany({
        where: {
          id,
          ...UNFINISHED_GAME,
          ...(delta < 0 ? { [field]: { gte: -delta } } : {}),
        },
        data: { [field]: { increment: delta } },
      });

      const updated = await tx.game.findUniqueOrThrow({ where: { id } });
      if (count === 0) {
        const finished = hasSavedResult({ ...updated, teamAScore: null, teamBScore: null });
        throw finished
          ? new ApiError("CONFLICT", FINISHED_GAME_SCORE_MESSAGE)
          : new ApiError("VALIDATION_ERROR", NEGATIVE_SCORE_MESSAGE);
      }
      return updated;
    });
  }
  /** Replaces every participant's rank at once. All-null ranks clear the result. */
  async saveMultiTeamResults(id: number, { results }: MultiTeamResultPayload) {
    return prisma.$transaction(async (tx) => {
      const game = await tx.game.findUnique({
        where: { id },
        include: {
          gameType: { select: { format: true } },
          participants: { select: { teamId: true } },
        },
      });
      if (!game) {
        throw new ApiError("NOT_FOUND", "Game not found.");
      }
      if (game.gameType.format !== "MULTI_TEAM") {
        throw new ApiError(
          "VALIDATION_ERROR",
          "Only multi-team games have placings.",
        );
      }

      const participantIds = game.participants.map((p) => p.teamId);
      const resultIds = results.map((r) => r.teamId);
      if (
        resultIds.length !== participantIds.length ||
        !sameTeamSet(participantIds, resultIds)
      ) {
        throw new ApiError(
          "VALIDATION_ERROR",
          RESULTS_MUST_MATCH_PARTICIPANTS_MESSAGE,
        );
      }

      for (const { teamId, rank } of results) {
        await tx.gameParticipant.update({
          where: { gameId_teamId: { gameId: id, teamId } },
          data: { rank },
        });
      }

      return tx.game.findUniqueOrThrow({ where: { id }, include: GAME_INCLUDE });
    });
  }
  async deleteGame(id: number) {
    return prisma.game.delete({
      where: { id },
    });
  }
  async getGameById(id: number) {
    const game = await prisma.game.findUnique({
      where: { id },
      include: GAME_INCLUDE,
    });
    if (!game) {
      throw new ApiError("NOT_FOUND", "Game not found.");
    }
    return game;
  }
}

export default GameService;
