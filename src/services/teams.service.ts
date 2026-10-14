import { prisma } from "@/src/lib/prisma";
import { ApiError } from "@/src/lib/api";
import { AddTeamPayload, EditTeamPayload } from "@/src/types/teams.types";

class TeamService {
  async getTeams() {
    return prisma.team.findMany({
      include: {
        gameTypes: {
          include: {
            gameType: true,
          },
        },
        teamSchools: {
          include: {
            school: true,
          },
        },
      },
    });
  }

  async getTeam(id: number) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        gameTypes: {
          include: {
            gameType: true,
          },
        },
        teamSchools: {
          include: {
            school: true,
          },
        },
      },
    });
    if (!team) {
      throw new ApiError("NOT_FOUND", "The requested team was not found.");
    }
    return team;
  }

  async addTeam({ teamName, schoolIds, gameTypeIds }: AddTeamPayload) {
    return prisma.team.create({
      data: {
        teamName,
        gameTypes: {
          create: gameTypeIds.map((gameTypeId) => ({
            gameTypeId,
          })),
        },
        teamSchools: {
          create: schoolIds.map((schoolId) => ({
            schoolId,
          })),
        },
      },
    });
  }

  async editTeam(id: number, { schoolIds, teamName, gameTypeIds }: EditTeamPayload) {
    return prisma.team.update({
      where: { id },
      data: {
        teamName,
        gameTypes: {
          deleteMany: {},
          create: gameTypeIds.map((gameTypeId) => ({
            gameTypeId,
          })),
        },
        teamSchools: {
          deleteMany: {},
          create: schoolIds.map((schoolId) => ({
            schoolId,
          })),
        },
      },
    });
  }

  async deleteTeam(id: number) {
    return prisma.team.delete({
      where: { id },
    });
  }
}

export default TeamService;
