-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "team_id" SERIAL NOT NULL,
    "team_name" VARCHAR(100) NOT NULL,
    "school_id" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "schools" (
    "school_id" SERIAL NOT NULL,
    "school_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("school_id")
);

-- CreateTable
CREATE TABLE "game_types" (
    "game_type_id" SERIAL NOT NULL,
    "game_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "game_types_pkey" PRIMARY KEY ("game_type_id")
);

-- CreateTable
CREATE TABLE "team_game_types" (
    "team_game_type_id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "gameTypeId" INTEGER NOT NULL,

    CONSTRAINT "team_game_types_pkey" PRIMARY KEY ("team_game_type_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "game_type_id" INTEGER NOT NULL,
    "team_a_id" INTEGER NOT NULL,
    "team_b_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" VARCHAR(255),

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "scores" (
    "score_id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "team_a_score" DECIMAL(10,2) NOT NULL,
    "team_b_score" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("score_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_school_name_key" ON "schools"("school_name");

-- CreateIndex
CREATE UNIQUE INDEX "scores_game_id_key" ON "scores"("game_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_game_types" ADD CONSTRAINT "team_game_types_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "game_types"("game_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_game_type_id_fkey" FOREIGN KEY ("game_type_id") REFERENCES "game_types"("game_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_a_id_fkey" FOREIGN KEY ("team_a_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_b_id_fkey" FOREIGN KEY ("team_b_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
