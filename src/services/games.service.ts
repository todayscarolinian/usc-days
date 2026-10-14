import { prisma } from "@/src/lib/prisma";
import {
  AddGamePayload,
  EditGamePayload,
  PaginationParams,
  PaginatedGamesResponse,
  SCORES_REQUIRE_TEAMS_MESSAGE,
  hasSavedResult,
} from "@/src/types/games.types";
import { ApiError } from "@/src/lib/api";
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

export interface GetGamesParams {
  gameTypeId?: number;
  teamAId?: number;
  teamBId?: number;
  teamId?: number; // matches either teamA or teamB
  winnerId?: number;
  location?: string;
  startDate?: Date;
  endDate?: Date;
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
    const cursor = params?.cursor;
    const limit = params?.limit;
    const offset = params?.offset;

    if (params?.gameTypeId) {
      where.gameTypeId = params.gameTypeId;
    }

    if (params?.teamAId) {
      where.teamAId = params.teamAId;
    }

    if (params?.teamBId) {
      where.teamBId = params.teamBId;
    }

    if (params?.teamId) {
      where.OR = [{ teamAId: params.teamId }, { teamBId: params.teamId }];
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

      if (dateConditions.length > 0) {
        where.AND = dateConditions;
      }
    }

    if (cursor !== undefined || limit !== undefined) {
      const cursorDate = cursor ? new Date(cursor) : null;
      const pageSize = Math.min(limit || 20, 100);

      if (cursorDate) {
        where.AND = where.AND || [];
        (where.AND as Prisma.GameWhereInput[]).push({
          startDate: { gt: cursorDate },
        });
      }

      const games = await prisma.game.findMany({
        where,
        include: {
          gameType: true,
          teamA: true,
          teamB: true,
          winner: true,
        },
        orderBy: [{ startDate: "asc" }, { createdAt: "asc" }],
        take: pageSize + 1,
      });

      const hasMore = games.length > pageSize;
      const paginatedGames = games.slice(0, pageSize);
      const nextCursor = hasMore
        ? paginatedGames[paginatedGames.length - 1]?.startDate.toISOString()
        : null;

      return { data: paginatedGames, hasMore, nextCursor };
    }

    // No pagination: return all games
    const games = await prisma.game.findMany({
      where,
      include: {
        gameType: true,
        teamA: true,
        teamB: true,
        winner: true,
      },
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
    }: AddGamePayload,
    createdByHeraldId: string,
  ) {
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

    // All validations passed, create the game
    const newGame = await prisma.game.create({
      data: {
        gameTypeId,
        teamAId: teamAId ?? null,
        teamBId: teamBId ?? null,
        startDate,
        endDate,
        location,
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
      teamAForfeited,
      teamBForfeited,
      isDraw,
    }: EditGamePayload,
  ) {
    const existing = await prisma.game.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError("NOT_FOUND", "Game not found.");
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
        ...(teamAForfeited !== undefined ? { teamAForfeited } : {}),
        ...(teamBForfeited !== undefined ? { teamBForfeited } : {}),
        ...(isDraw !== undefined ? { isDraw } : {}),
      },
    });
    return updatedGame;
  }
  async deleteGame(id: number) {
    return prisma.game.delete({
      where: { id },
    });
  }
  async getGameById(id: number) {
    const game = await prisma.game.findUnique({
      where: { id },
      include: { gameType: true, teamA: true, teamB: true },
    });
    if (!game) {
      throw new ApiError("NOT_FOUND", "Game not found.");
    }
    return game;
  }
}

export default GameService;
