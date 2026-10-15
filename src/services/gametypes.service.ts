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

  async addGameType({ gameName }: AddGameTypePayload) {
    return prisma.gameType.create({
      data: { gameName },
    })
  }

  async editGameType( id: number, { gameName }: EditGameTypePayload) {
    return prisma.gameType.update({
      where: { id },
      data: { gameName },
    });
  }

  async deleteGameType(id: number) {
    return prisma.gameType.delete({
        where: { id },
      });
  }
}

export default GameTypeService;
