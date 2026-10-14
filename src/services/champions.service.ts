import { prisma } from "@/src/lib/prisma";
import { AddChampionPayload } from "@/src/types/champions.types";
import { Prisma } from "@/src/lib/prisma/generated/client";
import { ApiError } from "@/src/lib/api";

export interface GetChampionsParams {
  teamId?: number;
  gameTypeId?: number;
  rank?: number;
  startDate?: Date;
  endDate?: Date;
}

class ChampionService {
  async getChampions(params?: GetChampionsParams) {
    const where: Prisma.ChampionWhereInput = {};

    if (params?.teamId) {
      where.teamId = params.teamId;
    }

    if (params?.gameTypeId) {
      where.gameTypeId = params.gameTypeId;
    }

    if (params?.rank) {
      where.rank = params.rank;
    }

    if (params?.startDate || params?.endDate) {
      where.OR = [];

      if (params.startDate && params.endDate) {
        where.OR.push({
          AND: [
            { startDate: { lte: params.endDate } },
            { endDate: { gte: params.startDate } },
          ],
        });
      } else if (params.startDate) {
        where.OR.push({ endDate: { gte: params.startDate } });
      } else if (params.endDate) {
        where.OR.push({ startDate: { lte: params.endDate } });
      }
    }

    return prisma.champion.findMany({
      where,
      include: {
        gameType: true,
        team: true,
      },
      orderBy: [{ rank: "asc" }, { startDate: "desc" }],
    });
  }

  async getChampionById(id: number) {
    const champion = await prisma.champion.findUnique({
      where: { id },
      include: {
        gameType: true,
        team: true,
      },
    });

    if (!champion) {
      throw new ApiError("NOT_FOUND", "Champion not found.");
    }

    return champion;
  }

  async addChampion({
    gameTypeId,
    teamId,
    startDate,
    endDate,
    rank,
  }: AddChampionPayload) {
    return prisma.champion.create({
      data: { gameTypeId, teamId, startDate, endDate, rank },
    });
  }

  async editChampion(id: number, payload: AddChampionPayload) {
    const { gameTypeId, teamId, startDate, endDate, rank } = payload;
    return prisma.champion.update({
      where: { id },
      data: { gameTypeId, teamId, startDate, endDate, rank },
    });
  }

  async deleteChampion(id: number) {
    return prisma.champion.delete({
      where: { id },
    });
  }
}

export default ChampionService;