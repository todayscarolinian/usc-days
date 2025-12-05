import { prisma } from "@/src/lib/prisma";
import {
  AddGamePayload,
  DeleteGamePayload,
  EditGamePayload,
} from "@/src/types/games.types";
import { Prisma } from "@/src/lib/prisma/generated/client";

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
  createdById?: number;
}

class GameService {
  async getGames(params?: GetGamesParams) {
    try {
      const where: Prisma.GameWhereInput = {};

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

      if (params?.createdById) {
        where.createdById = params.createdById;
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

      const games = await prisma.game.findMany({
        where,
        include: {
          gameType: true,
          teamA: true,
          teamB: true,
          winner: true,
          createdBy: true,
        },
        orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      });

      return games;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new Error("Could not fetch games");
    }
  }
  async addGame({
    gameTypeId,
    teamAId,
    teamBId,
    startDate,
    endDate,
    location,
    createdById,
  }: AddGamePayload) {
    try {
      const newGame = await prisma.game.create({
        data: {
          gameTypeId,
          teamAId,
          teamBId,
          startDate,
          endDate,
          location,
          createdById,
        },
      });
      return newGame;
    } catch (error) {
      console.error("Error adding game:", error);
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
  }: EditGamePayload) {
    try {
      if (winnerId !== null && winnerId !== undefined) {
        const validTeam = await prisma.team.findUnique({
          where: { id: winnerId },
        });

        if (!validTeam) {
          throw new Error(
            "winnerId must be either teamAId, teamBId, or null for unfinished games."
          );
        }

        if (winnerId !== teamAId && winnerId !== teamBId) {
          throw new Error(
            "winnerId must be either teamAId, teamBId, or null for unfinished games."
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
          winnerId: winnerId || null,
          startDate,
          endDate,
          location,
        },
      });
      return updatedGame;
    } catch (error) {
      console.error("Error updating game:", error);
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
