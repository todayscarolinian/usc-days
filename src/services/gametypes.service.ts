import { prisma } from "@/src/lib/prisma";
import { ApiError } from "@/src/lib/api";
import {
  AddGameTypePayload,
  EditGameTypePayload,
} from "@/src/types/gametypes.types";

class GameTypeService {
  async getGameTypes() {
    return prisma.gameType.findMany();
  }

  async getGameTypeById(id: number) {
    const gameType = await prisma.gameType.findUnique({where: { id } });
    if(!gameType) {
      throw new ApiError("NOT_FOUND", "Sport not found.");
    }
    return gameType;
  }

  async getGameTypeTeams(id: number) {
    const gameType = await prisma.gameType.findUnique({
      where: { id },
      select: {
        teams: {
          include: {
            team: { select: { teamName: true } },
          },
        },
      },
    });
    if(!gameType) {
      throw new ApiError("NOT_FOUND", "Sport not found.");
    }
    return gameType.teams;
  }

  async addGameType({ gameName, format }: AddGameTypePayload) {
    return prisma.gameType.create({
      data: { gameName, format },
    })
  }

  /** A sport's format is fixed once it has games, so no game ends up in the wrong format. */
  async editGameType( id: number, { gameName, format }: EditGameTypePayload) {
    if (format !== undefined) {
      const sport = await prisma.gameType.findUnique({
        where: { id },
        select: { format: true, _count: { select: { games: true } } },
      });
      if (sport && sport.format !== format && sport._count.games > 0) {
        throw new ApiError(
          "CONFLICT",
          "A sport's format cannot change once it has games.",
        );
      }
    }
    return prisma.gameType.update({
      where: { id },
      data: { gameName, format },
    });
  }

  async deleteGameType(id: number) {
    return prisma.gameType.delete({
        where: { id },
      });
  }
}

export default GameTypeService;
