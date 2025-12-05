import { prisma } from "@/src/lib/prisma";
import {
  AddChampionPayload,
  DeleteChampionPayload,
  EditChampionPayload,
} from "@/src/types/champions.types";
import { Prisma } from "@/src/lib/prisma/generated/client";

export interface GetChampionsParams {
  teamId?: number;
  gameTypeId?: number;
  rank?: number;
  startDate?: Date;
  endDate?: Date;
}

class ChampionService {
  async getChampions(params?: GetChampionsParams) {
    try {
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

      const champions = await prisma.champion.findMany({
        where,
        include: {
          gameType: true,
          team: true,
        },
        orderBy: [{ rank: "asc" }, { startDate: "desc" }],
      });

      return champions;
    } catch (error) {
      console.error("Error fetching champions:", error);
      throw new Error("Could not fetch champions");
    }
  }
  async addChampion({
    gameTypeId,
    teamId,
    startDate,
    endDate,
    rank,
  }: AddChampionPayload) {
    try {
      const newChampion = await prisma.champion.create({
        data: {
          gameTypeId,
          teamId,
          startDate,
          endDate,
          rank,
        },
      });
      return newChampion;
    } catch (error) {
      console.error("Error adding champion:", error);
      throw new Error(
        "An unexpected error occurred while adding the champion."
      );
    }
  }
  async editChampion({
    id,
    gameTypeId,
    teamId,
    startDate,
    endDate,
    rank,
  }: EditChampionPayload) {
    try {
      const updatedChampion = await prisma.champion.update({
        where: { id },
        data: {
          gameTypeId,
          teamId,
          startDate,
          endDate,
          rank,
        },
      });
      return updatedChampion;
    } catch (error) {
      console.error("Error updating champion:", error);
      throw new Error(
        "An unexpected error occurred while updating the champion."
      );
    }
  }
  async deleteChampion({ id }: DeleteChampionPayload) {
    try {
      const deletedChampion = await prisma.champion.delete({
        where: { id },
      });
      return deletedChampion;
    } catch (error) {
      console.error("Error deleting champion:", error);
      throw new Error(
        "An unexpected error occurred while deleting the champion."
      );
    }
  }
}

export default ChampionService;
