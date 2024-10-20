/*
  Warnings:

  - You are about to drop the column `endDate` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
