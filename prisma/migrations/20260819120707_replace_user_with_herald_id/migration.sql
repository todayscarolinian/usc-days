/*
  Warnings:

  - You are about to drop the column `created_by` on the `games` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_created_by_fkey";

-- AlterTable
ALTER TABLE "games" DROP COLUMN "created_by",
ADD COLUMN     "created_by_herald_id" VARCHAR(255);

-- DropTable
DROP TABLE "users";
