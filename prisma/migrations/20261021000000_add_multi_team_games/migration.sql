-- CreateEnum
CREATE TYPE "GameFormat" AS ENUM ('HEAD_TO_HEAD', 'MULTI_TEAM');

-- AlterTable
ALTER TABLE "game_types" ADD COLUMN "format" "GameFormat" NOT NULL DEFAULT 'HEAD_TO_HEAD';

-- CreateTable
CREATE TABLE "game_participants" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "game_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_participants_team_id_idx" ON "game_participants"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_participants_game_id_team_id_key" ON "game_participants"("game_id", "team_id");

-- AddForeignKey
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Swimming sports are multi-team. Sports that already have A/B games keep their format
-- until those games are converted, so no game is left in a format it does not match.
UPDATE "game_types"
SET "format" = 'MULTI_TEAM'
WHERE "game_name" ~* 'swim|freestyle|backstroke|butterfly|breaststroke|medley'
  AND NOT EXISTS (SELECT 1 FROM "games" WHERE "games"."game_type_id" = "game_types"."id");
