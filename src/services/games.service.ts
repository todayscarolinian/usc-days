import { prisma } from "@/lib/prisma";

class GameService {
    async getGames() {
        try {
            const games = await prisma.game.findMany({
                include: {
                    gameType: true,
                    teamA: true,
                    teamB: true,
                    score: true,
                },
            });

            return games;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw new Error('Could not fetch games');
        }
    }

}

export default GameService
