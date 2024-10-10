-- DropForeignKey
ALTER TABLE "team_game_types" DROP CONSTRAINT "team_game_types_team_id_fkey";

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
