import { prisma } from "@/lib/prisma";
import { AddChampionPayload, DeleteChampionPayload, EditChampionPayload } from "@/types/champions.types";

class ChampionService {
    async getChampions() {
        try {
            const champions = await prisma.champion.findMany({
                include: {
                    gameType: true,
                    team: true
                },
            });

            return champions;
        } catch (error) {
            console.error('Error fetching champions:', error);
            throw new Error('Could not fetch champions');
        }
    }
    async addChampion({ gameTypeId, teamId, startDate, endDate, rank }: AddChampionPayload) {
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
            console.error('Error adding champion:', error);
            throw new Error('An unexpected error occurred while adding the champion.');
        }
    }
    async editChampion({ id, gameTypeId, teamId, startDate, endDate, rank }: EditChampionPayload) {
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
            console.error('Error updating champion:', error);
            throw new Error('An unexpected error occurred while updating the champion.');
        }
    }
    async deleteChampion({ id }: DeleteChampionPayload) {
        try {
            const deletedChampion = await prisma.champion.delete({
                where: { id },
            });
            return deletedChampion;
        } catch (error) {
            console.error('Error deleting champion:', error);
            throw new Error('An unexpected error occurred while deleting the champion.');
        }
    }
}

export default ChampionService
