import { prisma } from '@/lib/prisma';

class TeamService {
    async getTeams() {
        const teams = await prisma.team.findMany()
        return teams;
    }
}

export default TeamService;
