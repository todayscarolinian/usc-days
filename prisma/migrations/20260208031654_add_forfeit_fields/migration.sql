-- AlterTable
ALTER TABLE "games" ADD COLUMN     "team_a_forfeited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "team_b_forfeited" BOOLEAN NOT NULL DEFAULT false;
