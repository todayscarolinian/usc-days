import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getGameStatus } from "@/src/lib/game-status";
import { getMatchdayGameStatus } from "@/src/lib/todays-games";
import {
  buildScheduleEvents,
  getScheduleDay,
  getScheduleEventName,
  groupScheduleGames,
  parseScheduleDate,
  parseScheduleId,
  type ScheduleFilters,
} from "@/src/lib/schedules";
import type { Schedules } from "@/src/types/types";

const now = new Date("2026-10-15T04:00:00Z");
const today = "2026-10-15";
const noFilters: ScheduleFilters = { event: null, sportId: null, teamId: null, date: null };

// Exercise the serialized values returned by the API, including numeric scores.
function game(overrides: Record<string, unknown> = {}): Schedules {
  return {
    id: 1,
    startDate: "2026-10-15T03:30:00Z",
    endDate: "2026-10-15T04:30:00Z",
    gameType: { id: 1, gameName: "Men's Basketball" },
    teamA: { id: 10, teamName: "SAS" },
    teamB: { id: 20, teamName: "SAFAD" },
    teamAScore: null,
    teamBScore: null,
    winnerId: null,
    isDraw: false,
    teamAForfeited: false,
    teamBForfeited: false,
    ...overrides,
  } as unknown as Schedules;
}

describe("shared match status", () => {
  it("distinguishes upcoming, live, and elapsed schedules without results", () => {
    assert.equal(getGameStatus(game(), now), "live");
    assert.equal(getGameStatus(game({ startDate: "2026-10-16T03:00:00Z" }), now), "upcoming");
    assert.equal(getGameStatus(game({ endDate: now.toISOString() }), now), "ended");
  });

  it("treats zero scores, draws, winners, and forfeits as results regardless of time", () => {
    for (const result of [
      { teamAScore: 0, teamBScore: 0 },
      { isDraw: true },
      { winnerId: 10 },
      { teamAForfeited: true },
      { teamBForfeited: true },
    ]) {
      assert.equal(getGameStatus(game(result), now), "finished");
      assert.equal(getMatchdayGameStatus(game(result), now), null);
    }
  });

  it("keeps homepage status behavior compatible", () => {
    assert.equal(getMatchdayGameStatus(game(), now), "ONGOING");
    assert.equal(getMatchdayGameStatus(game({ startDate: "2026-10-16T03:00:00Z" }), now), "UPCOMING");
    assert.equal(getMatchdayGameStatus(game({ endDate: now.toISOString() }), now), null);
    assert.equal(getGameStatus(game({ teamAScore: 0 }), now), "live");
  });
});

describe("schedule dates and query parameters", () => {
  it("groups UTC evenings into the next Manila calendar day", () => {
    assert.equal(getScheduleDay(new Date("2026-10-14T16:00:00Z")), today);
    assert.equal(getScheduleDay(new Date("2026-10-14T15:59:59Z")), "2026-10-14");
  });

  it("rejects malformed dates and IDs without throwing", () => {
    for (const date of [null, "", "2026-02-30", "2026-13-01", "2026-1-01", "oops"]) {
      assert.equal(parseScheduleDate(date), null);
    }
    assert.equal(parseScheduleDate("2028-02-29"), "2028-02-29");
    for (const id of [null, "", "0", "-1", "1.5", "Infinity", "9007199254740992"]) {
      assert.equal(parseScheduleId(id), null);
    }
    assert.equal(parseScheduleId("20"), 20);
  });
});

describe("event categories", () => {
  it("normalizes gender variants and historical names without merging distinct events", () => {
    const cases = {
      "Women's Basketball": "Basketball",
      "Men's Basketball (3x3)": "3x3 Basketball",
      Football: "Soccer",
      "Flag Football": "Flag Football",
      "E-Sports (Mobile Legends)": "Mobile Legends",
      "Women's 50m Backstroke": "Swimming",
      "Mr. USC Days": "Mr. & Ms. USC",
      "New Competition": "New Competition",
    };
    for (const [input, expected] of Object.entries(cases)) {
      assert.equal(getScheduleEventName(input), expected);
    }
  });

  it("deduplicates event variants and only marks ongoing events live", () => {
    const sports = [
      { id: 1, gameName: "Men's Basketball" },
      { id: 2, gameName: "Women's Basketball" },
      { id: 3, gameName: "Flag Football" },
    ];
    const groups = buildScheduleEvents(sports, [game(), game({ gameType: sports[2], isDraw: true })], now);
    assert.deepEqual(groups, [
      { name: "Court", events: [{ name: "Basketball", isLive: true }] },
      { name: "Field", events: [{ name: "Flag Football", isLive: false }] },
    ]);
  });
});

describe("schedule filtering and ordering", () => {
  it("combines event, date, and away-team filters and tolerates TBD teams", () => {
    const matches = [
      game(),
      game({ id: 2, teamA: null, teamB: null }),
      game({ id: 3, gameType: { id: 3, gameName: "Volleyball" } }),
      game({ id: 4, startDate: "2026-10-16T03:00:00Z" }),
    ];
    const days = groupScheduleGames(matches, { ...noFilters, event: "Basketball", teamId: 20, date: today }, today);
    assert.deepEqual(days.map(day => day.games.map(match => match.id)), [[1]]);
    assert.equal(groupScheduleGames(matches, { ...noFilters, teamId: 999 }, today).length, 0);
  });

  it("preserves legacy sport IDs while allowing a named event to include all variants", () => {
    const matches = [game(), game({ id: 2, gameType: { id: 2, gameName: "Women's Basketball" } })];
    const legacy = groupScheduleGames(matches, { ...noFilters, sportId: 1 }, today);
    const event = groupScheduleGames(matches, { ...noFilters, sportId: 1, event: "Basketball" }, today);
    assert.equal(legacy[0].games.length, 1);
    assert.equal(event[0].games.length, 2);
  });

  it("orders today, future dates, then recent past without mutating query records", () => {
    const matches = [
      game({ id: 5, startDate: "2026-10-13T04:00:00Z" }),
      game({ id: 3, startDate: "2026-10-16T04:00:00Z" }),
      game({ id: 2, startDate: "2026-10-15T04:00:00Z" }),
      game({ id: 4, startDate: "2026-10-14T04:00:00Z" }),
      game({ id: 1, startDate: "2026-10-15T04:00:00Z" }),
      game({ id: 6, startDate: "invalid" }),
    ];
    const originalOrder = matches.map(match => match.id);
    const days = groupScheduleGames(matches, noFilters, today);
    assert.deepEqual(days.map(day => day.date), [today, "2026-10-16", "2026-10-14", "2026-10-13"]);
    assert.deepEqual(days[0].games.map(match => match.id), [1, 2]);
    assert.deepEqual(matches.map(match => match.id), originalOrder);
  });
});
