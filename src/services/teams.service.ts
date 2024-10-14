import { prisma } from '@/lib/prisma';
import { AddTeamPayload, EditTeamPayload } from '@/types/teams.types';

class TeamService {
    async getTeams() {
        try {
            const teams = await prisma.team.findMany({
                include: {
                    gameTypes: true,
                    teamSchools: {
                        include: {
                            school: true,
                        },
                    },
                },
            });
            return teams;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('An unexpected error occurred while fetching teams.');
        }
    }
    async addTeam({ teamName, schoolIds, gameTypeIds }: AddTeamPayload) {
        try {
            const newTeam = await prisma.team.create({
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
            return newTeam;
        } catch (error) {
            console.error('Error adding a team:', error);
            throw new Error('An unexpected error occurred while adding the team.');
        }
    }
    async editTeam({ id, schoolIds, teamName, gameTypeIds }: EditTeamPayload) {
        try {
            const updatedTeam = await prisma.team.update({
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
            return updatedTeam;
        } catch (error) {
            console.error('Error updating the team:', error);
            throw new Error('An unexpected error occurred while updating the team.');
        }
    }
    async deleteTeam(id: number) {
        try {
            const deletedTeam = await prisma.team.delete({
                where: { id },
            });

            return deletedTeam;
        } catch (error) {
            console.error('Error deleting team:', error);
            throw new Error('An unexpected error occurred while deleting the team.');
        }
    }
}

export default TeamService;

