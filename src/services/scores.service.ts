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
          createdBy: true,
        },
      });

      return scores;
    } catch (error) {
      console.error("Error fetching scores: ", error);
      throw new Error("An unexpected error occurred while fetching scores.");
    }
  }

  async createScore(scoreData: Score) {
    try {
      const { gameId, teamAScore, teamBScore, createdBy } = scoreData;
      const newScore = await prisma.score.create({
        data: {
          gameId,
          teamAScore,
          teamBScore,
          createdBy,
        },
      });

      return newScore;
    } catch (error) {
      console.error("Error creating score: ", error);
      throw new Error("An unexpected error ocurred while creating the score.");
    }
  }

  async updateScore(scoreData: Partial<Score>) {
    try {
      const { gameId, teamAScore, teamBScore } = scoreData;
      const updatedScore = await prisma.score.update({
        where: { gameId },
        data: { teamAScore, teamBScore },
      });

      return updatedScore;
    } catch (error) {
      console.error("Error updating score: ", error);
      throw new Error("An unexpected error occurred while updating the score.");
    }
  }

  async deleteScore(gameId: number) {
    try {
      const deletedScore = await prisma.score.delete({
        where: { gameId },
      });

      return deletedScore;
    } catch (error) {
      console.error("Error deleting score: ", error);
      throw new Error("An unexpected error occurred while deleting the score.");
    }
  }
}

export default ScoreService;
