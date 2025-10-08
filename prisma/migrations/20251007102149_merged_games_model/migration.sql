/*
  Warnings:

  - You are about to drop the `scores` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `created_by` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."scores" DROP CONSTRAINT "scores_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."scores" DROP CONSTRAINT "scores_game_id_fkey";

-- AlterTable
ALTER TABLE "public"."games" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "team_a_score" DECIMAL(10,2),
ADD COLUMN     "team_b_score" DECIMAL(10,2),
ADD COLUMN     "winner_id" INTEGER;

-- DropTable
DROP TABLE "public"."scores";

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."games" ADD CONSTRAINT "games_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
