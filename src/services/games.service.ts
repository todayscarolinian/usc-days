import { prisma } from "@/src/lib/prisma";
import {
  AddGamePayload,
  DeleteGamePayload,
  EditGamePayload,
  PaginationParams,
  PaginatedGamesResponse,
  SCORES_REQUIRE_TEAMS_MESSAGE,
  hasSavedResult,
  isScoresRequireTeamsError,
} from "@/src/types/games.types";
import { Prisma } from "@/src/lib/prisma/generated/client";
import { Schedules } from "../types/types";

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
  teamAId?: number | null;
  teamBId?: number | null;
  teamAScore?: unknown;
  teamBScore?: unknown;
  winnerId?: number | null;
  teamAForfeited?: boolean;
  teamBForfeited?: boolean;
  isDraw?: boolean;
};

/** Omitted fields keep the stored value. Explicit null clears a team or result. */
export function resolveEditedGame(
  existing: StoredGameTeams,
  edit: GameTeamEdit,
): StoredGameTeams {
  return {
    teamAId: edit.teamAId !== undefined ? edit.teamAId : existing.teamAId,
    teamBId: edit.teamBId !== undefined ? edit.teamBId : existing.teamBId,
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
    throw new Error(SCORES_REQUIRE_TEAMS_MESSAGE);
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
   * If no pagination params provided, returns all matching games (legacy behavior).
   */
  async getGames(
    params?: GetGamesWithPaginationParams,
  ): Promise<Schedules[] | PaginatedGamesResponse> {
    try {
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

        return {
          games: paginatedGames,
          hasMore,
          nextCursor,
          count: paginatedGames.length,
        };
      }

      // Legacy behavior: no pagination, return all games
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

      return games;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new Error("Could not fetch games");
    }
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
    try {
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
          throw new Error(
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
          throw new Error(
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
    } catch (error) {
      console.error("Error adding game:", error);

      if (
        error instanceof Error &&
        (error.message.includes("already exists") ||
          error.message.includes("already booked"))
      ) {
        throw error;
      }

      throw new Error("An unexpected error occurred while adding the game.");
    }
  }
  async editGame({
    id,
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
  }: EditGamePayload) {
    try {
      const existing = await prisma.game.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Game not found.");
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
        throw new Error("A game cannot be both a draw and have forfeits.");
      }

      // Validate: Draw requires equal scores
      if (isDraw && teamAScore !== teamBScore) {
        throw new Error("For a draw, both teams must have equal scores.");
      }

      // Validate: Draw requires winnerId to be null
      if (isDraw && winnerId !== null && winnerId !== undefined) {
        throw new Error("For a draw, winnerId must be null.");
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
          throw new Error(
            "winnerId must be either teamAId, teamBId, or null for unfinished games.",
          );
        }

        if (winnerId !== teamAId && winnerId !== teamBId) {
          throw new Error(
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
    } catch (error) {
      console.error("Error updating game:", error);
      if (isScoresRequireTeamsError(error)) {
        throw error;
      }
      throw new Error("An unexpected error occurred while updating the game.");
    }
  }
  async deleteGame({ id }: DeleteGamePayload) {
    try {
      const deletedGame = await prisma.game.delete({
        where: { id },
      });
      return deletedGame;
    } catch (error) {
      console.error("Error deleting game:", error);
      throw new Error("An unexpected error occurred while deleting the game.");
    }
  }
  async getGameById(id: number) {
    return prisma.game.findUnique({
      where: { id },
      include: { gameType: true, teamA: true, teamB: true },
    });
  }
}

export default GameService;
