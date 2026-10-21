-- A team can enter a multi-team game more than once (e.g. two swimmers from one school).

-- DropIndex
DROP INDEX "game_participants_game_id_team_id_key";

-- CreateIndex
CREATE INDEX "game_participants_game_id_idx" ON "game_participants"("game_id");
