import { prisma } from "@/lib/prisma";
import { Score } from "@/types/scores.types";

class ScoreService {
  async getScores() {
    try {
      const scores = await prisma.score.findMany({
        include: {
          game: {
            include: {
              teamA: true,
              teamB: true,
              gameType: true,
            },
          },
          createdAt: true,
          createdBy: true,
        },
      });
      return scores;
    } catch (error) {
      console.error("Error fetching scores:", error);
      throw new Error("An unexpected error occurred while fetching scores.");
    }
  }

  async createScore(data: {
    gameId: string;
    teamAScore: number;
    teamBScore: number;
    createdAt: Date;
    createdBy: string;
  }) {
    try {
      const newScore = await prisma.score.create({
        data,
      });
      return newScore;
    } catch (error) {
      console.error("Error creating score:", error);
      throw new Error("An unexpected error occurred while creating the score.");
    }
  }

  async updateScore(gameId: string, teamAScore: number, teamBScore: number) {
    try {
      const updatedScore = await prisma.score.update({
        where: { gameId },
        data: { teamAScore, teamBScore },
      });
      return updatedScore;
    } catch (error) {
      console.error("Error updating score:", error);
      throw new Error("An unexpected error occurred while updating the score.");
    }
  }

  async deleteScore(gameId: string) {
    try {
      const deletedScore = await prisma.score.delete({
        where: { gameId },
      });
      return deletedScore;
    } catch (error) {
      console.error("Error deleting score:", error);
      throw new Error("An unexpected error occurred while deleting the score.");
    }
  }
}

export default ScoreService;
