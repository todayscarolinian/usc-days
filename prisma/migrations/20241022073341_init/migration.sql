-- CreateTable
CREATE TABLE "Champion" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "game_type_id" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Champion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Champion_team_id_key" ON "Champion"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Champion_game_type_id_key" ON "Champion"("game_type_id");

-- AddForeignKey
ALTER TABLE "Champion" ADD CONSTRAINT "Champion_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Champion" ADD CONSTRAINT "Champion_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
