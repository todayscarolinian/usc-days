/*
  Warnings:

  - You are about to drop the `team_schools` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `school_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_schools" DROP CONSTRAINT "team_schools_school_id_fkey";

-- DropForeignKey
ALTER TABLE "team_schools" DROP CONSTRAINT "team_schools_team_id_fkey";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "school_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "team_schools";

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
