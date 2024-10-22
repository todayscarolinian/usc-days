/*
  Warnings:

  - You are about to drop the `Champion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Champion" DROP CONSTRAINT "Champion_game_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Champion" DROP CONSTRAINT "Champion_team_id_fkey";

-- DropTable
DROP TABLE "Champion";

-- CreateTable
CREATE TABLE "champions" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "game_type_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "champions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "champions_team_id_key" ON "champions"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "champions_game_type_id_key" ON "champions"("game_type_id");

-- AddForeignKey
ALTER TABLE "champions" ADD CONSTRAINT "champions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "champions" ADD CONSTRAINT "champions_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
