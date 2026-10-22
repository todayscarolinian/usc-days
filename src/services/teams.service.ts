import { prisma } from "@/src/lib/prisma";
import { ApiError } from "@/src/lib/api";
import { AddTeamPayload, EditTeamPayload } from "@/src/types/teams.types";

class TeamService {
  async getTeams() {
    return prisma.team.findMany({
      include: {
        school: true,
      },
    });
  }

  async getTeam(id: number) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        school: true,
      },
    });
    if (!team) {
      throw new ApiError("NOT_FOUND", "The requested team was not found.");
    }
    return team;
  }

  async addTeam({ teamName, schoolId }: AddTeamPayload) {
    return prisma.team.create({
      data: {
        teamName,
        schoolId,
      },
    });
  }

  async editTeam(id: number, { schoolId, teamName }: EditTeamPayload) {
    return prisma.team.update({
      where: { id },
      data: {
        teamName,
        schoolId,
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
