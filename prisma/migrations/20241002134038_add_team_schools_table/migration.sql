/*
  Warnings:

  - You are about to drop the column `school_id` on the `teams` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_school_id_fkey";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "school_id";

-- CreateTable
CREATE TABLE "team_schools" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,

    CONSTRAINT "team_schools_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_schools" ADD CONSTRAINT "team_schools_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_schools" ADD CONSTRAINT "team_schools_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
