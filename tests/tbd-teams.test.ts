import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { describe, it } from "vitest";
import {
  AddGameSchema,
  EditGameSchema,
  MultiTeamResultSchema,
  SCORES_REQUIRE_TEAMS_MESSAGE,
  hasSavedResult,
} from "@/src/types/games.types";
import { ApiError } from "@/src/lib/api";
import {
  assertTeamsSetForResults,
  duplicateTeamMatchupFilter,
  resolveEditedGame,
  planEntryEdit,
  sameEntries,
  type StoredGameTeams,
} from "@/src/services/games.service";
import { transformTeamsData } from "@/src/components/standings/transformTeamsData";
import type { Schedules } from "@/src/types/types";

const require = createRequire(import.meta.url);
require.extensions[".png"] = (module) => {
  module.exports = { src: "/logo.png" };
};

const startDate = "2026-10-14T09:00:00.000Z";
const endDate = "2026-10-14T10:00:00.000Z";

function addPayload(overrides: Record<string, unknown> = {}) {
  return {
    gameTypeId: 1,
    teamAId: 10,
    teamBId: 20,
    startDate,
    endDate,
    location: "Court 1",
    ...overrides,
  };
}

function editPayload(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    gameTypeId: 1,
    teamAId: 10,
    teamBId: 20,
    startDate,
    endDate,
    teamAScore: null,
    teamBScore: null,
    winnerId: null,
    teamAForfeited: false,
    teamBForfeited: false,
    isDraw: false,
    ...overrides,
  };
}

function storedGame(overrides: Partial<StoredGameTeams> = {}): StoredGameTeams {
  return {
    teamAId: 10,
    teamBId: 20,
    teamAScore: 2,
    teamBScore: 0,
    winnerId: 10,
    teamAForfeited: false,
    teamBForfeited: false,
    isDraw: false,
    ...overrides,
  };
}

function schedule(overrides: Partial<Schedules> = {}): Schedules {
  return {
    id: 1,
    gameTypeId: 3,
    teamAId: 10,
    teamBId: 20,
    location: null,
    endDate: new Date(endDate),
    startDate: new Date(startDate),
    createdAt: new Date(startDate),
    createdByHeraldId: null,
    teamAScore: null,
    teamBScore: null,
    winnerId: null,
    teamAForfeited: false,
    teamBForfeited: false,
    isDraw: false,
    label: null,
    gameType: { id: 3, gameName: "Basketball", format: "HEAD_TO_HEAD" },
    teamA: { id: 10, teamName: "SOE Blue", schoolId: 1, school: { id: 1, schoolName: "SOE" } },
    teamB: { id: 20, teamName: "SBE Red", schoolId: 2, school: { id: 2, schoolName: "SBE" } },
    winner: null,
    participants: [],
    ...overrides,
  } as Schedules;
}

function expectTeamsMessage(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(
    result.error?.issues.some((issue) => issue.message === SCORES_REQUIRE_TEAMS_MESSAGE),
  );
}

describe("AddGameSchema", () => {
  it("accepts a game with either team or both teams missing", () => {
    assert.equal(AddGameSchema.safeParse(addPayload({ teamAId: null })).success, true);
    assert.equal(AddGameSchema.safeParse(addPayload({ teamBId: null })).success, true);
    assert.equal(
      AddGameSchema.safeParse(addPayload({ teamAId: null, teamBId: null, location: undefined })).success,
      true,
    );
    assert.equal(AddGameSchema.safeParse(addPayload({ teamAId: undefined, teamBId: undefined })).success, true);
  });

  it("still rejects two known teams that are the same", () => {
    const result = AddGameSchema.safeParse(addPayload({ teamAId: 10, teamBId: 10 }));
    assert.equal(result.success, false);
  });

  it("rejects a non-numeric team id", () => {
    const result = AddGameSchema.safeParse(addPayload({ teamAId: "TBD" }));
    assert.equal(result.success, false);
  });
});

describe("multi-team payloads", () => {
  const entries = (...teamIds: number[]) => teamIds.map((teamId) => ({ teamId }));
  const participants = { teamAId: null, teamBId: null, participants: entries(10, 20, 30) };

  it("accepts participants in place of team A and team B", () => {
    assert.equal(AddGameSchema.safeParse(addPayload(participants)).success, true);
    assert.equal(EditGameSchema.safeParse(editPayload(participants)).success, true);
  });

  it("accepts several entries from one team but not fewer than two entries", () => {
    assert.equal(AddGameSchema.safeParse(addPayload({ ...participants, participants: entries(10, 10, 20) })).success, true);
    assert.equal(AddGameSchema.safeParse(addPayload({ ...participants, participants: entries(10) })).success, false);
  });

  it("requires a team for every entry and stores a blank name as no name", () => {
    assert.equal(AddGameSchema.safeParse(addPayload({ ...participants, participants: entries(10, -1) })).success, false);
    const result = AddGameSchema.safeParse(addPayload({
      ...participants,
      participants: [{ teamId: 10, name: "  Yu, Ashley " }, { teamId: 20, name: "  " }],
    }));
    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data.participants?.map((entry) => entry.name), ["Yu, Ashley", null]);
    }
  });

  it("rejects team A, team B, or an A/B result alongside participants", () => {
    assert.equal(AddGameSchema.safeParse(addPayload({ ...participants, teamAId: 10 })).success, false);
    assert.equal(EditGameSchema.safeParse(editPayload({ ...participants, teamAScore: 3 })).success, false);
  });

  it("accepts tied and unranked placings but not an entry ranked twice", () => {
    assert.equal(
      MultiTeamResultSchema.safeParse({
        results: [{ participantId: 1, rank: 1 }, { participantId: 2, rank: 1 }, { participantId: 3, rank: null }],
      }).success,
      true,
    );
    assert.equal(MultiTeamResultSchema.safeParse({ results: [{ participantId: 1, rank: 0 }] }).success, false);
    assert.equal(
      MultiTeamResultSchema.safeParse({
        results: [{ participantId: 1, rank: 1 }, { participantId: 1, rank: 2 }],
      }).success,
      false,
    );
  });

  it("compares entry lists regardless of order, counting repeated teams", () => {
    assert.equal(sameEntries([10, 20, 10], [10, 10, 20]), true);
    assert.equal(sameEntries([10, 20], [10, 20, 20]), false);
    assert.equal(sameEntries([10, 10, 20], [10, 20, 20]), false);
  });

  it("lets names change without counting as a change of teams", () => {
    const stored = [{ id: 1, teamId: 10, rank: 1 }, { id: 2, teamId: 20, rank: 2 }];

    const renamed = planEntryEdit(stored, [{ id: 1, teamId: 10, name: "Yu, Ashley" }, { id: 2, teamId: 20 }]);
    assert.equal(renamed.teamsChanged, false);
    assert.deepEqual(renamed.removedIds, []);

    assert.equal(planEntryEdit(stored, [{ id: 1, teamId: 30 }, { id: 2, teamId: 20 }]).teamsChanged, true);
    const shrunk = planEntryEdit(stored, [{ id: 1, teamId: 10 }, { teamId: 30 }]);
    assert.equal(shrunk.teamsChanged, true);
    assert.deepEqual(shrunk.removedIds, [2]);
    assert.deepEqual(shrunk.added, [{ teamId: 30 }]);
  });

  it("rejects an entry id from another game", () => {
    assert.throws(
      () => planEntryEdit([{ id: 1, teamId: 10, rank: null }], [{ id: 99, teamId: 10 }]),
      (error: unknown) => error instanceof ApiError,
    );
  });
});

describe("EditGameSchema results", () => {
  it("allows an ordinary TBD schedule edit", () => {
    const result = EditGameSchema.safeParse(
      editPayload({
        teamAId: null,
        teamBId: null,
        teamAScore: null,
        teamBScore: null,
        winnerId: null,
        teamAForfeited: false,
        teamBForfeited: false,
        isDraw: false,
      }),
    );
    assert.equal(result.success, true);
  });

  it("allows omitted result fields on a TBD game", () => {
    const result = EditGameSchema.safeParse(
      editPayload({
        teamAId: null,
        teamBId: 20,
        teamAScore: undefined,
        teamBScore: undefined,
        winnerId: undefined,
        teamAForfeited: undefined,
        teamBForfeited: undefined,
        isDraw: undefined,
      }),
    );
    assert.equal(result.success, true);
  });

  it("rejects a score of 0 when a team is missing", () => {
    expectTeamsMessage(
      EditGameSchema.safeParse(editPayload({ teamAId: null, teamAScore: 0, teamBScore: null })),
    );
    expectTeamsMessage(
      EditGameSchema.safeParse(editPayload({ teamBId: null, teamAScore: null, teamBScore: 0 })),
    );
  });

  it("rejects a winner, a draw, and either or both forfeits without both teams", () => {
    expectTeamsMessage(EditGameSchema.safeParse(editPayload({ teamAId: null, winnerId: 20 })));
    expectTeamsMessage(EditGameSchema.safeParse(editPayload({ teamBId: null, isDraw: true, teamAScore: 1, teamBScore: 1, winnerId: null })));
    expectTeamsMessage(
      EditGameSchema.safeParse(editPayload({ teamAId: null, teamAForfeited: true, winnerId: 20 })),
    );
    expectTeamsMessage(
      EditGameSchema.safeParse(editPayload({ teamBId: null, teamBForfeited: true, winnerId: 10 })),
    );
    expectTeamsMessage(
      EditGameSchema.safeParse(
        editPayload({
          teamAId: null,
          teamBId: null,
          teamAForfeited: true,
          teamBForfeited: true,
          winnerId: null,
        }),
      ),
    );
  });

  it("rejects an edit that leaves out a team id", () => {
    const payload = editPayload({ teamAScore: 2, teamBScore: 1, winnerId: 10 });
    delete payload.teamAId;
    const result = EditGameSchema.safeParse(payload);
    assert.equal(result.success, false);
  });

  it("allows a score of 0 once both teams are set", () => {
    const result = EditGameSchema.safeParse(
      editPayload({
        teamAScore: 0,
        teamBScore: 2,
        winnerId: 20,
      }),
    );
    assert.equal(result.success, true);
  });
});

describe("effective edit state", () => {
  const scored = storedGame();

  it("preserves stored results when the edit omits them", () => {
    const resolved = resolveEditedGame(scored, {
      teamAId: null,
      teamBId: scored.teamBId,
    });
    assert.equal(resolved.teamAId, null);
    assert.equal(resolved.teamBId, 20);
    assert.equal(resolved.teamAScore, 2);
    assert.equal(resolved.winnerId, 10);
    assert.throws(
      () => assertTeamsSetForResults(resolved),
      (error: unknown) =>
        error instanceof ApiError &&
        error.code === "VALIDATION_ERROR" &&
        error.message === SCORES_REQUIRE_TEAMS_MESSAGE,
    );
  });

  it("treats explicit null as clearing a team", () => {
    const resolved = resolveEditedGame(scored, {
      teamAId: scored.teamAId,
      teamBId: null,
    });
    assert.equal(resolved.teamBId, null);
    assert.throws(() => assertTeamsSetForResults(resolved), {
      message: SCORES_REQUIRE_TEAMS_MESSAGE,
    });
  });

  it("rejects clearing a team for score 0, winner, draw, and forfeits", () => {
    const cases: StoredGameTeams[] = [
      storedGame({ teamAScore: 0, teamBScore: 0, winnerId: null, isDraw: true }),
      storedGame({ teamAScore: 0, teamBScore: 1, winnerId: 20 }),
      storedGame({ teamAForfeited: true, teamBForfeited: false, winnerId: 20, teamAScore: 0, teamBScore: 0 }),
      storedGame({ teamAForfeited: false, teamBForfeited: true, winnerId: 10, teamAScore: 0, teamBScore: 0 }),
      storedGame({ teamAForfeited: true, teamBForfeited: true, winnerId: null, teamAScore: 0, teamBScore: 0 }),
    ];

    for (const existing of cases) {
      assert.equal(hasSavedResult(existing), true);
      assert.throws(
        () =>
          assertTeamsSetForResults(
            resolveEditedGame(existing, {
              teamAId: null,
              teamBId: existing.teamBId,
            }),
          ),
        { message: SCORES_REQUIRE_TEAMS_MESSAGE },
      );
    }
  });

  it("does not treat false flags or null scores as results", () => {
    const open = storedGame({
      teamAScore: null,
      teamBScore: null,
      winnerId: null,
      teamAForfeited: false,
      teamBForfeited: false,
      isDraw: false,
    });
    assert.equal(hasSavedResult(open), false);
    assert.doesNotThrow(() =>
      assertTeamsSetForResults(resolveEditedGame(open, { teamAId: null, teamBId: null })),
    );
  });

  it("allows scoring after both teams are known", () => {
    const ready = resolveEditedGame(
      storedGame({
        teamAId: null,
        teamBId: null,
        teamAScore: null,
        teamBScore: null,
        winnerId: null,
      }),
      { teamAId: 10, teamBId: 20, teamAScore: 0, teamBScore: 1, winnerId: 20 },
    );
    assert.doesNotThrow(() => assertTeamsSetForResults(ready));
  });
});

describe("duplicate matchup filter", () => {
  it("skips the duplicate check unless both teams are known", () => {
    assert.equal(duplicateTeamMatchupFilter(1, null, null), null);
    assert.equal(duplicateTeamMatchupFilter(1, 10, null), null);
    assert.equal(duplicateTeamMatchupFilter(1, null, 20), null);
    assert.equal(duplicateTeamMatchupFilter(1, undefined, undefined), null);
  });

  it("matches a known pair in either order", () => {
    const filter = duplicateTeamMatchupFilter(4, 10, 20);
    assert.deepEqual(filter, {
      gameTypeId: 4,
      OR: [
        { AND: [{ teamAId: 10 }, { teamBId: 20 }] },
        { AND: [{ teamAId: 20 }, { teamBId: 10 }] },
      ],
    });
  });
});

describe("standings and leaderboards", () => {
  it("skips games that are missing a team and counts a finished game", () => {
    const rows = transformTeamsData([
      schedule({ id: 1, teamA: null, teamB: { id: 20, teamName: "SBE Red", schoolId: 2, school: { id: 2, schoolName: "SBE" } }, teamAId: null }),
      schedule({ id: 2, teamA: { id: 10, teamName: "SOE Blue", schoolId: 1, school: { id: 1, schoolName: "SOE" } }, teamB: null, teamBId: null }),
      schedule({ id: 3, teamA: null, teamB: null, teamAId: null, teamBId: null }),
      schedule({
        id: 4,
        teamAScore: 0 as unknown as Schedules["teamAScore"],
        teamBScore: 1 as unknown as Schedules["teamBScore"],
        winnerId: 20,
        winner: { id: 20, teamName: "SBE Red" },
      }),
    ]);

    assert.deepEqual(
      rows.map((row) => ({ team: row.team, wins: row.wins, losses: row.losses })),
      [
        { team: "SBE Red", wins: 1, losses: 0 },
        { team: "SOE Blue", wins: 0, losses: 1 },
      ],
    );
  });

  it("skips incomplete games in the school leaderboard", async () => {
    const { transformSchoolsData } = await import(
      "@/src/components/leaderboards/transformSchoolsData"
    );
    const rows = transformSchoolsData([
      schedule({ id: 1, teamA: null }),
      schedule({
        id: 2,
        winnerId: 10,
        winner: { id: 10, teamName: "SOE Blue" },
        teamAScore: 2 as unknown as Schedules["teamAScore"],
        teamBScore: 0 as unknown as Schedules["teamBScore"],
      }),
    ]);

    assert.deepEqual(
      rows.map((row) => ({ team: row.team, wins: row.wins, losses: row.losses })),
      [
        { team: "SOE", wins: 1, losses: 0 },
        { team: "SBE", wins: 0, losses: 1 },
      ],
    );
  });
});
