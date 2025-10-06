import { prisma } from "@/lib/prisma";
import {
    AddGamePayload,
    DeleteGamePayload,
    EditGamePayload,
} from "@/types/games.types";

class GameService {

    async getGames() {
        try {
            const games = await prisma.game.findMany({
                include: {
                    gameType: true,
                    teamA: true,
                    teamB: true,
                },
            });

            return games;
        } catch (error) {
            console.error("Error fetching games:", error);
            throw new Error("Could not fetch games");
        }
    }
    async addGame({
        gameTypeId,
        teamAId,
        teamBId,
        startDate,
        endDate,
        location,
        createdById,
    }: AddGamePayload) {
        try {
            const newGame = await prisma.game.create({
                data: {
                    gameTypeId,
                    teamAId,
                    teamBId,
                    startDate,
                    endDate,
                    location,
                    createdById,
                },
            });
            return newGame;
        } catch (error) {
            console.error("Error adding game:", error);
            throw new Error(
                "An unexpected error occurred while adding the game."
            );
        }
    }
    async editGame({
        id,
        gameTypeId,
        teamAId,
        teamBId,
        teamAScore,
        teamBScore,
        winnerId,
        startDate,
        endDate,
        location,
    }: EditGamePayload) {
        try {
            if (winnerId !== null && winnerId !== undefined) {
                const validTeam = await prisma.team.findUnique({
                    where: { id: winnerId },
                });

                if (!validTeam) {
                    throw new Error(
                        "winnerId must be either teamAId, teamBId, or null for unfinished games."
                    );
                }

                if (winnerId !== teamAId && winnerId !== teamBId) {
                    throw new Error(
                        "winnerId must be either teamAId, teamBId, or null for unfinished games."
                    );
                }
            }

            const updatedGame = await prisma.game.update({
                where: { id },
                data: {
                    gameTypeId,
                    teamAId,
                    teamBId,
                    teamAScore,
                    teamBScore,
                    winnerId: winnerId || null,
                    startDate,
                    endDate,
                    location,
                },
            });
            return updatedGame;
        } catch (error) {
            console.error("Error updating game:", error);
            throw new Error(
                "An unexpected error occurred while updating the game."
            );
        }
    }
    async deleteGame({ id }: DeleteGamePayload) {
        try {
            const deletedGame = await prisma.game.delete({
                where: { id },
            });
            return deletedGame;
        } catch (error) {
            console.error("Error deleting game:", error);
            throw new Error(
                "An unexpected error occurred while deleting the game."
            );
        }
    }
}

export default GameService;
