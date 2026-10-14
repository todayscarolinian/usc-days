import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { Client } from "pg";
import GameService from "@/src/services/games.service";
import { SCORES_REQUIRE_TEAMS_MESSAGE } from "@/src/types/games.types";
import { transformTeamsData } from "@/src/components/standings/transformTeamsData";
import type { Schedules } from "@/src/types/types";

const databaseUrl = process.env.POSTGRES_DB_URL ?? "";
const local =
  databaseUrl.includes("127.0.0.1") || databaseUrl.includes("localhost");

describe("game service against local database", { skip: local ? false : "POSTGRES_DB_URL is not a local database" }, () => {
  const games = new GameService();
  const client = new Client({ connectionString: databaseUrl });
  const createdGameIds: number[] = [];
  let gameTypeId = 0;
  let teamAId = 0;
  let teamBId = 0;
  const start = "2035-01-01T01:00:00.000Z";
  const end = "2035-01-01T02:00:00.000Z";

  before(async () => {
    await client.connect();
    const sport = await client.query(
      `INSERT INTO game_types (game_name) VALUES ('TBD regression sport') RETURNING id`,
    );
    gameTypeId = sport.rows[0].id;
    const teams = await client.query(
      `INSERT INTO teams (team_name) VALUES ('SOE Local A'), ('SBE Local B') RETURNING id, team_name`,
    );
    teamAId = teams.rows[0].id;
    teamBId = teams.rows[1].id;
  });

  after(async () => {
    if (createdGameIds.length > 0) {
      await client.query(`DELETE FROM games WHERE id = ANY($1::int[])`, [
        createdGameIds,
      ]);
    }
    await client.query(`DELETE FROM teams WHERE id = ANY($1::int[])`, [
      [teamAId, teamBId],
    ]);
    await client.query(`DELETE FROM game_types WHERE id = $1`, [gameTypeId]);
    await client.end();
  });

  async function create(overrides: Record<string, unknown> = {}) {
    const game = await games.addGame(
      {
        gameTypeId,
        teamAId: null,
        teamBId: null,
        startDate: start,
        endDate: end,
        ...overrides,
      },
      "tbd-regression",
    );
    createdGameIds.push(game.id);
    return game;
  }

  it("creates games with either team or both teams missing", async () => {
    const onlyB = await create({ teamBId });
    const onlyA = await create({ teamAId, startDate: "2035-01-02T01:00:00.000Z", endDate: "2035-01-02T02:00:00.000Z" });
    const neither = await create({
      startDate: "2035-01-03T01:00:00.000Z",
      endDate: "2035-01-03T02:00:00.000Z",
    });
    assert.equal(onlyB.teamAId, null);
    assert.equal(onlyB.teamBId, teamBId);
    assert.equal(onlyA.teamAId, teamAId);
    assert.equal(onlyA.teamBId, null);
    assert.equal(neither.teamAId, null);
    assert.equal(neither.teamBId, null);
  });

  it("does not treat two TBD games at the same sport and time as duplicates", async () => {
    const first = await create({
      startDate: "2035-02-01T01:00:00.000Z",
      endDate: "2035-02-01T02:00:00.000Z",
    });
    const second = await create({
      startDate: "2035-02-01T01:00:00.000Z",
      endDate: "2035-02-01T02:00:00.000Z",
    });
    assert.notEqual(first.id, second.id);
  });

  it("still rejects a known-team duplicate and a venue clash", async () => {
    await create({
      teamAId,
      teamBId,
      location: "Local Court",
      startDate: "2035-03-01T01:00:00.000Z",
      endDate: "2035-03-01T02:00:00.000Z",
    });

    await assert.rejects(
      () =>
        create({
          teamAId: teamBId,
          teamBId: teamAId,
          startDate: "2035-03-01T01:30:00.000Z",
          endDate: "2035-03-01T02:30:00.000Z",
        }),
      /already exists/,
    );

    await assert.rejects(
      () =>
        create({
          location: "local court",
          startDate: "2035-03-01T01:15:00.000Z",
          endDate: "2035-03-01T01:45:00.000Z",
        }),
      /already booked/,
    );
  });

  it("rejects draw, winner, and forfeit results while a team is missing", async () => {
    const open = await create({
      startDate: "2035-05-01T01:00:00.000Z",
      endDate: "2035-05-01T02:00:00.000Z",
    });
    const base = {
      id: open.id,
      gameTypeId,
      teamAId: null,
      teamBId: teamBId,
      startDate: "2035-05-01T01:00:00.000Z",
      endDate: "2035-05-01T02:00:00.000Z",
      location: null,
    };
    const attempts = [
      { teamAScore: 0, teamBScore: 0, winnerId: null, isDraw: true },
      { winnerId: teamBId },
      { teamAForfeited: true, winnerId: teamBId },
      { teamBForfeited: true, winnerId: null },
      { teamAForfeited: true, teamBForfeited: true, winnerId: null },
    ];
    for (const attempt of attempts) {
      await assert.rejects(() => games.editGame({ ...base, ...attempt }), {
        message: SCORES_REQUIRE_TEAMS_MESSAGE,
      });
    }
  });

  it("rejects scores and clearing a team until both teams are set, then accepts a real result", async () => {
    const open = await create({
      teamAId,
      teamBId,
      startDate: "2035-04-01T01:00:00.000Z",
      endDate: "2035-04-01T02:00:00.000Z",
    });

    const base = {
      id: open.id,
      gameTypeId,
      startDate: "2035-04-01T01:00:00.000Z",
      endDate: "2035-04-01T02:00:00.000Z",
      location: null,
    };

    await assert.rejects(
      () =>
        games.editGame({
          ...base,
          teamAId: null,
          teamBId,
          teamAScore: 0,
          teamBScore: 1,
          winnerId: teamBId,
        }),
      { message: SCORES_REQUIRE_TEAMS_MESSAGE },
    );

    const scored = await games.editGame({
      ...base,
      teamAId,
      teamBId,
      teamAScore: 0,
      teamBScore: 1,
      winnerId: teamBId,
      isDraw: false,
      teamAForfeited: false,
      teamBForfeited: false,
    });
    assert.equal(Number(scored.teamAScore), 0);
    assert.equal(scored.winnerId, teamBId);

    await assert.rejects(
      () =>
        games.editGame({
          ...base,
          teamAId: null,
          teamBId,
        }),
      { message: SCORES_REQUIRE_TEAMS_MESSAGE },
    );

    const rows = transformTeamsData([
      {
        ...open,
        teamA: null,
        teamB: { id: teamBId, teamName: "SBE Local B" },
        teamAId: null,
      } as Schedules,
      {
        ...scored,
        gameType: { id: gameTypeId, gameName: "Basketball" },
        teamA: { id: teamAId, teamName: "SOE Local A" },
        teamB: { id: teamBId, teamName: "SBE Local B" },
        winner: { id: teamBId, teamName: "SBE Local B" },
      } as Schedules,
    ]);
    assert.equal(rows.find((row) => row.team === "SBE Local B")?.wins, 1);
    assert.equal(rows.find((row) => row.team === "SOE Local A")?.losses, 1);
  });
});
