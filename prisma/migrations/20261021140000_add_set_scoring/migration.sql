CREATE TYPE "ScoringMode" AS ENUM ('LINEAR', 'SETS');
CREATE TYPE "SetStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

ALTER TABLE "game_types" ADD COLUMN "scoring_mode" "ScoringMode" NOT NULL DEFAULT 'LINEAR';
ALTER TABLE "game_types" ADD CONSTRAINT "game_types_scoring_format_check"
  CHECK ("scoring_mode" <> 'SETS' OR "format" = 'HEAD_TO_HEAD');
ALTER TABLE "games" ADD COLUMN "best_of" INTEGER,
  ADD COLUMN "scoring_version" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "games" ADD CONSTRAINT "games_best_of_check" CHECK ("best_of" IN (3, 5));

CREATE TABLE "game_sets" (
  "id" SERIAL NOT NULL,
  "game_id" INTEGER NOT NULL,
  "set_number" INTEGER NOT NULL,
  "team_a_points" INTEGER NOT NULL DEFAULT 0,
  "team_b_points" INTEGER NOT NULL DEFAULT 0,
  "status" "SetStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  CONSTRAINT "game_sets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "game_sets_set_number_check" CHECK ("set_number" BETWEEN 1 AND 5),
  CONSTRAINT "game_sets_points_check" CHECK ("team_a_points" >= 0 AND "team_b_points" >= 0),
  CONSTRAINT "game_sets_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "game_sets_game_id_set_number_key" ON "game_sets"("game_id", "set_number");

-- Configure existing volleyball sports once; runtime behavior uses scoring_mode, not names.
UPDATE "game_types" SET "scoring_mode" = 'SETS'
WHERE "game_name" ILIKE '%volleyball%' AND "format" = 'HEAD_TO_HEAD';
UPDATE "games" SET "best_of" = 3
WHERE "game_type_id" IN (SELECT "id" FROM "game_types" WHERE "scoring_mode" = 'SETS');
-- Existing scores remain untouched. Staff can choose best-of-five for placement games.
