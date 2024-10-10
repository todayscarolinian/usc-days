/*
  Warnings:

  - The primary key for the `game_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `game_type_id` on the `game_types` table. All the data in the column will be lost.
  - The primary key for the `games` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `game_id` on the `games` table. All the data in the column will be lost.
  - The primary key for the `schools` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `school_id` on the `schools` table. All the data in the column will be lost.
  - The primary key for the `scores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `score_id` on the `scores` table. All the data in the column will be lost.
  - The primary key for the `team_game_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_game_type_id` on the `team_game_types` table. All the data in the column will be lost.
  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `teams` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_game_type_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_team_a_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_team_b_id_fkey";

-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_created_by_fkey";

-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_game_id_fkey";

-- DropForeignKey
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_gameTypeId_fkey";

-- DropForeignKey
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_teamId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_school_id_fkey";

-- AlterTable
ALTER TABLE "game_types" DROP CONSTRAINT "game_types_pkey",
DROP COLUMN "game_type_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "game_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "games" DROP CONSTRAINT "games_pkey",
DROP COLUMN "game_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "schools" DROP CONSTRAINT "schools_pkey",
DROP COLUMN "school_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "scores" DROP CONSTRAINT "scores_pkey",
DROP COLUMN "score_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "scores_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_pkey",
DROP COLUMN "team_game_type_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "team_game_types_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
DROP COLUMN "team_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_a_id_fkey" FOREIGN KEY ("team_a_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_b_id_fkey" FOREIGN KEY ("team_b_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
