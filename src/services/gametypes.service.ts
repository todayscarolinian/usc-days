import { prisma } from "@/src/lib/prisma";
import {
  AddGameTypePayload,
  DeleteGameTypePayload,
  EditGameTypePayload,
} from "@/src/types/gametypes.types";

class GameTypeService {
  async getGameTypes() {
    try {
      const gametypes = await prisma.gameType.findMany();
      return gametypes;
    } catch (error) {
      console.error("Error fetching gametypes:", error);
      throw new Error("Could not fetch gametypes.");
    }
  }

  async addGameType({ gameName }: AddGameTypePayload) {
    try {
      const newGameType = await prisma.gameType.create({
        data: {
          gameName,
        },
      });

      return newGameType;
    } catch (error) {
      console.log("Error adding gametype: ", error);
      throw new Error("An unexpected error occured while adding the gametype.");
    }
  }

  async editGameType({ id, gameName }: EditGameTypePayload) {
    try {
      const updatedGameType = await prisma.gameType.update({
        where: { id },
        data: {
          gameName,
        },
      });
      return updatedGameType;
    } catch (error) {
      console.error("Error updating gametype:", error);
      throw new Error(
        "An unexpected error occurred while updating the gametype."
      );
    }
  }

  async deleteGameType({ id }: DeleteGameTypePayload) {
    try {
      const deletedGame = await prisma.gameType.delete({
        where: { id },
      });
      return deletedGame;
    } catch (error) {
      console.error("Error deleting gametype:", error);
      throw new Error(
        "An unexpected error occurred while deleting the gametype."
      );
    }
  }
}

export default GameTypeService;
