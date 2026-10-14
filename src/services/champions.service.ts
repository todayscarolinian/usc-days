import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@/src/lib/prisma/generated/client";
import { ApiError } from "@/src/lib/api";
import type { AddChampionPayload } from "@/src/types/champions.types";

export interface GetChampionsParams {
  teamId?: number;
  gameTypeId?: number;
  rank?: number;
  startDate?: Date;
  endDate?: Date;
}

const championInclude = {
  gameType: true,
  team: true,
} satisfies Prisma.ChampionInclude;

class ChampionService {
  async getChampions(params?: GetChampionsParams) {
    const where: Prisma.ChampionWhereInput = {};

    if (params?.teamId) where.teamId = params.teamId;
    if (params?.gameTypeId) where.gameTypeId = params.gameTypeId;
    if (params?.rank) where.rank = params.rank;

    // Overlap semantics: champion period intersects [startDate, endDate]
    if (params?.startDate && params?.endDate) {
      where.AND = [
        { startDate: { lte: params.endDate } },
        { endDate: { gte: params.startDate } },
      ];
    } else if (params?.startDate) {
      where.endDate = { gte: params.startDate };
    } else if (params?.endDate) {
      where.startDate = { lte: params.endDate };
    }

    return prisma.champion.findMany({
      where,
      include: championInclude,
      orderBy: [{ rank: "asc" }, { startDate: "desc" }],
    });
  }

  async getChampionById(id: number) {
    const champion = await prisma.champion.findUnique({
      where: { id },
      include: championInclude,
    });

    if (!champion) {
      throw new ApiError(404, "Champion not found.");
    }

    return champion;
  }

  async addChampion(payload: AddChampionPayload) {
    const { gameTypeId, teamId, startDate, endDate, rank } = payload;

    return prisma.champion.create({
      data: { gameTypeId, teamId, startDate, endDate, rank },
      include: championInclude,
    });
  }

  // Full replacement. Throws Prisma P2025 if the id doesn't exist.
  async editChampion(id: number, payload: AddChampionPayload) {
    const { gameTypeId, teamId, startDate, endDate, rank } = payload;

    return prisma.champion.update({
      where: { id },
      data: { gameTypeId, teamId, startDate, endDate, rank },
      include: championInclude,
    });
  }

  // Hard delete (unchanged behaviour). Throws Prisma P2025 if missing.
  async deleteChampion(id: number) {
    return prisma.champion.delete({ where: { id } });
  }
}

export default ChampionService;