import { prisma } from '@/lib/prisma';

class TeamService {
    async getTeams() {
        try {
            const teams = await prisma.team.findMany();
            return teams;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('An unexpected error occurred while fetching teams.');
        }
    }
}

export default TeamService;

