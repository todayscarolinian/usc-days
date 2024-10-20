/*
  Warnings:

  - You are about to drop the column `gameTypeId` on the `team_game_types` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `team_game_types` table. All the data in the column will be lost.
  - Added the required column `game_type_id` to the `team_game_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `team_game_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_gameTypeId_fkey";

-- DropForeignKey
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_teamId_fkey";

-- AlterTable
ALTER TABLE "team_game_types" DROP COLUMN "gameTypeId",
DROP COLUMN "teamId",
ADD COLUMN     "game_type_id" INTEGER NOT NULL,
ADD COLUMN     "team_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
