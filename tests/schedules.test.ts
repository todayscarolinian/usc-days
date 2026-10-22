import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { getGameStatus } from "@/src/lib/game-status";
import { getMatchdayGameStatus, selectTodaysGames } from "@/src/lib/todays-games";
import { entryLabels, ordinal, participatingTeams, sortedParticipants } from "@/src/lib/multi-team";
import {
  addScheduleDays,
  buildScheduleEvents,
  getScheduleGameTypeIds,
  getScheduleLoadedRange,
  isScheduleDateLoaded,
  getScheduleDay,
  getScheduleEventName,
  groupScheduleGames,
  groupSwimmingMatches,
  parseScheduleDate,
  parseScheduleId,
  type ScheduleFilters,
} from "@/src/lib/schedules";
import type { Schedules } from "@/src/types/types";
import {
  completeScheduleAutoScrollRequest,
  getPendingScheduleAutoScrollRequest,
  isScheduleAutoScrollScopeReady,
  requestFullScheduleAutoScroll,
  selectScheduleAutoScrollTarget,
  subscribeToScheduleAutoScrollRequests,
  type ScheduleAutoScrollRequest,
} from "@/src/lib/schedule-auto-scroll";

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
    assert.equal(getGameStatus(game({ endDate: now.toISOString() }), now), "awaiting");
  });

  it("treats draws, winners, and forfeits as results regardless of time", () => {
    for (const result of [
      { isDraw: true },
      { winnerId: 10 },
      { teamAForfeited: true },
      { teamBForfeited: true },
    ]) {
      assert.equal(getGameStatus(game(result), now), "finished");
      assert.equal(getMatchdayGameStatus(game(result), now), null);
    }
  });

  it("keeps scored games without a result live until they end, then awaiting a result", () => {
    const scores = { teamAScore: 3, teamBScore: 0 };
    assert.equal(getGameStatus(game(scores), now), "live");
    assert.equal(getMatchdayGameStatus(game(scores), now), "ONGOING");
    assert.equal(getGameStatus(game({ ...scores, endDate: now.toISOString() }), now), "awaiting");
    assert.equal(getMatchdayGameStatus(game({ ...scores, endDate: now.toISOString() }), now), null);
  });

  it("keeps homepage status behavior compatible", () => {
    assert.equal(getMatchdayGameStatus(game(), now), "ONGOING");
    assert.equal(getMatchdayGameStatus(game({ startDate: "2026-10-16T03:00:00Z" }), now), "UPCOMING");
    assert.equal(getMatchdayGameStatus(game({ endDate: now.toISOString() }), now), null);
    assert.equal(getGameStatus(game({ teamAScore: 0 }), now), "live");
  });

  it("finishes a multi-team game once any participant is ranked", () => {
    const multiTeam = (ranks: (number | null)[], overrides: Record<string, unknown> = {}) =>
      game({
        gameType: { id: 2, gameName: "Men's 50m Freestyle", format: "MULTI_TEAM" },
        teamA: null,
        teamB: null,
        participants: ranks.map((rank, i) => ({ teamId: 10 + i, rank })),
        ...overrides,
      });

    assert.equal(getGameStatus(multiTeam([null, null]), now), "live");
    assert.equal(getGameStatus(multiTeam([null, null], { startDate: "2026-10-16T03:00:00Z" }), now), "upcoming");
    assert.equal(getGameStatus(multiTeam([null, null], { endDate: now.toISOString() }), now), "awaiting");
    assert.equal(getGameStatus(multiTeam([1, null]), now), "finished");
  });

  it("orders placings by rank, ties by name, unranked last", () => {
    const participant = (teamName: string, rank: number | null) => ({ teamId: teamName.length, rank, team: { teamName } });
    const order = sortedParticipants(game({
      participants: [participant("SOE", null), participant("SBE", 2), participant("SAS", 2), participant("SAFAD", 1)],
    })).map((p) => p.team.teamName);
    assert.deepEqual(order, ["SAFAD", "SAS", "SBE", "SOE"]);
    assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 23].map(ordinal),
      ["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd"]);
  });

  it("shows a multi-team game on the homepage once it has entries", () => {
    const swim = (id: number, participants: unknown[]) => game({
      id,
      gameType: { id: 2, gameName: "Women's 50m Freestyle", format: "MULTI_TEAM" },
      teamA: null,
      teamB: null,
      participants,
    });
    const entry = { id: 1, teamId: 10, name: null, rank: null, team: { id: 10, teamName: "SOE" } };
    const { featured, compact } = selectTodaysGames([swim(1, []), swim(2, [entry])], now);
    assert.deepEqual([...featured, ...compact].map(g => g.id), [2]);
  });

  it("labels named entries by name and numbers a team's unnamed entries", () => {
    const entry = (id: number, teamId: number, teamName: string, name: string | null = null) =>
      ({ id, teamId, name, rank: null, team: { id: teamId, teamName } });
    const g = game({ participants: [entry(1, 10, "SOE"), entry(2, 20, "SAFAD"), entry(3, 10, "SOE"), entry(4, 10, "SOE", "Bagtasos, Laurianna")] });
    assert.deepEqual(
      [...entryLabels(g)].sort(([a], [b]) => a - b),
      [[1, "SOE (1)"], [2, "SAFAD"], [3, "SOE (2)"], [4, "Bagtasos, Laurianna — SOE"]],
    );
    assert.deepEqual(participatingTeams(g).map(team => team.teamName), ["SOE", "SAFAD"]);
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
      Football: "Football",
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

  it("lists Chess under Board Games separately from Esports", () => {
    const groups = buildScheduleEvents([
      { id: 1, gameName: "Chess" },
      { id: 2, gameName: "Valorant" },
    ], [], now);
    assert.deepEqual(groups, [
      { name: "Esports", events: [{ name: "Valorant", isLive: false }] },
      { name: "Board Games", events: [{ name: "Chess", isLive: false }] },
    ]);
  });

  it("keeps one Swimming tab and groups its matches by distance and stroke", () => {
    const sports = [
      { id: 25, gameName: "Men's Swimming 200m Freestyle" },
      { id: 26, gameName: "Women's Swimming 200m Freestyle" },
      { id: 27, gameName: "Men's 50m Backstroke" },
      { id: 35, gameName: "Men's 4x50 Medley Relay" },
      { id: 36, gameName: "Women's 4x50m Medley Relay" },
    ];
    const matches = sports.map((sport, index) => game({ id: index + 1, gameType: sport }));
    const aquatics = buildScheduleEvents(sports, matches, now).find(group => group.name === "Aquatics");
    assert.deepEqual(aquatics?.events.map(event => event.name), ["Swimming"]);
    assert.equal(aquatics?.events[0].isLive, true);
    assert.equal(groupScheduleGames(matches, { ...noFilters, event: "Swimming" })[0].games.length, 5);
    const categories = groupSwimmingMatches(matches);
    assert.deepEqual(categories.map(category => category.name), ["200m Freestyle", "50m Backstroke", "4x50m Medley Relay"]);
    assert.deepEqual(categories.map(category => category.games.map(match => match.id)), [[1, 2], [3], [4, 5]]);
    assert.deepEqual(groupSwimmingMatches([game({ gameType: { id: 13, gameName: "Swimming" } })]).map(category => category.name), ["Swimming"]);
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
    const days = groupScheduleGames(matches, { ...noFilters, event: "Basketball", teamId: 20, date: today });
    assert.deepEqual(days.map(day => day.games.map(match => match.id)), [[1]]);
    assert.equal(groupScheduleGames(matches, { ...noFilters, teamId: 999 }).length, 0);

    const swim = game({
      id: 5,
      gameType: { id: 5, gameName: "Men's 50m Freestyle", format: "MULTI_TEAM" },
      teamA: null,
      teamB: null,
      participants: [{ id: 1, teamId: 30, rank: null, team: { id: 30, teamName: "SOE" } }],
    });
    const filtered = groupScheduleGames([swim], { ...noFilters, teamId: 30 });
    assert.deepEqual(filtered.map(day => day.games.map(match => match.id)), [[5]]);
  });

  it("preserves legacy sport IDs while allowing a named event to include all variants", () => {
    const matches = [game(), game({ id: 2, gameType: { id: 2, gameName: "Women's Basketball" } })];
    const legacy = groupScheduleGames(matches, { ...noFilters, sportId: 1 });
    const event = groupScheduleGames(matches, { ...noFilters, sportId: 1, event: "Basketball" });
    assert.equal(legacy[0].games.length, 1);
    assert.equal(event[0].games.length, 2);
  });

  it("orders days chronologically without mutating query records", () => {
    const matches = [
      game({ id: 5, startDate: "2026-10-13T04:00:00Z" }),
      game({ id: 3, startDate: "2026-10-16T04:00:00Z" }),
      game({ id: 2, startDate: "2026-10-15T04:00:00Z" }),
      game({ id: 4, startDate: "2026-10-14T04:00:00Z" }),
      game({ id: 1, startDate: "2026-10-15T04:00:00Z" }),
      game({ id: 6, startDate: "invalid" }),
    ];
    const originalOrder = matches.map(match => match.id);
    const days = groupScheduleGames(matches, noFilters);
    assert.deepEqual(days.map(day => day.date), ["2026-10-13", "2026-10-14", today, "2026-10-16"]);
    assert.deepEqual(days[2].games.map(match => match.id), [1, 2]);
    assert.deepEqual(matches.map(match => match.id), originalOrder);
  });
});

describe("schedule auto-scroll targeting", () => {
  it("publishes a new request for every full-schedule click", () => {
    const received: ScheduleAutoScrollRequest[] = [];
    const unsubscribe = subscribeToScheduleAutoScrollRequests(request => received.push(request));

    try {
      requestFullScheduleAutoScroll();
      requestFullScheduleAutoScroll();

      assert.equal(received.length, 2);
      assert.equal(received[0].source, "full-schedule");
      assert.equal(received[1].source, "full-schedule");
      assert.ok(received[1].id > received[0].id);
      completeScheduleAutoScrollRequest(received[0].id);
      assert.equal(getPendingScheduleAutoScrollRequest()?.id, received[1].id);
      completeScheduleAutoScrollRequest(received[1].id);
      assert.equal(getPendingScheduleAutoScrollRequest(), null);
    } finally {
      const pending = getPendingScheduleAutoScrollRequest();
      if (pending) completeScheduleAutoScrollRequest(pending.id);
      unsubscribe();
    }
  });

  it("prefers the first live match in displayed order over upcoming matches", () => {
    const days = [{
      date: today,
      games: [
        game({ id: 1, startDate: "2026-10-15T05:00:00Z" }),
        game({ id: 2 }),
        game({ id: 3, startDate: "2026-10-15T03:45:00Z", endDate: "2026-10-15T04:45:00Z" }),
      ],
    }];

    assert.equal(selectScheduleAutoScrollTarget(days, now)?.id, 2);
  });

  it("otherwise chooses the earliest strictly future match", () => {
    const days = [{
      date: today,
      games: [
        game({ id: 3, startDate: "2026-10-15T07:00:00Z" }),
        game({ id: 1, winnerId: 10 }),
        game({ id: 2, startDate: "2026-10-15T05:00:00Z" }),
      ],
    }];

    assert.equal(selectScheduleAutoScrollTarget(days, now)?.id, 2);
  });

  it("uses the grouped Swimming display order for live matches", () => {
    const days = [{
      date: today,
      games: [
        game({
          id: 1,
          startDate: "2026-10-15T01:00:00Z",
          endDate: "2026-10-15T02:00:00Z",
          winnerId: 10,
          gameType: { id: 1, gameName: "Men's 50m Freestyle" },
        }),
        game({
          id: 2,
          startDate: "2026-10-15T03:00:00Z",
          endDate: "2026-10-15T05:00:00Z",
          gameType: { id: 2, gameName: "Men's 100m Backstroke" },
        }),
        game({
          id: 3,
          gameType: { id: 3, gameName: "Women's 50m Freestyle" },
        }),
      ],
    }];

    assert.equal(selectScheduleAutoScrollTarget(days, now)?.id, 2);
    assert.equal(selectScheduleAutoScrollTarget(days, now, true)?.id, 3);
  });

  it("does not target finished, elapsed, or exactly-now matches", () => {
    const days = [{
      date: today,
      games: [
        game({ id: 1, winnerId: 10 }),
        game({ id: 2, endDate: now.toISOString() }),
        game({ id: 3, startDate: now.toISOString(), endDate: now.toISOString() }),
      ],
    }];

    assert.equal(selectScheduleAutoScrollTarget(days, now), null);
  });

  it("selects only from the displayed event-filter scope", () => {
    const days = groupScheduleGames([
      game({ id: 1, gameType: { id: 2, gameName: "Volleyball" } }),
      game({ id: 2, startDate: "2026-10-15T05:00:00Z" }),
    ], { ...noFilters, event: "Basketball" });

    assert.equal(selectScheduleAutoScrollTarget(days, now)?.id, 2);
  });

  it("waits for the requested navigation or event-filter scope", () => {
    const fullRequest: ScheduleAutoScrollRequest = { id: 1, source: "full-schedule" };
    assert.equal(isScheduleAutoScrollScopeReady(fullRequest, noFilters, null), true);
    assert.equal(isScheduleAutoScrollScopeReady(fullRequest, { ...noFilters, teamId: 10 }, null), false);
    assert.equal(isScheduleAutoScrollScopeReady(fullRequest, noFilters, "3"), false);

    const eventRequest: ScheduleAutoScrollRequest = { id: 2, source: "event-filter", event: "Basketball" };
    assert.equal(isScheduleAutoScrollScopeReady(
      eventRequest,
      { ...noFilters, event: "Basketball", teamId: 10 },
      null,
    ), true);
    assert.equal(isScheduleAutoScrollScopeReady(eventRequest, { ...noFilters, event: "Volleyball" }, null), false);
    assert.equal(isScheduleAutoScrollScopeReady(
      eventRequest,
      { ...noFilters, event: "Basketball", date: today },
      null,
    ), false);
  });
});

describe("schedule window helpers", () => {
  const sports = [
    { id: 1, gameName: "Men's Basketball" },
    { id: 2, gameName: "Women's Basketball" },
    { id: 3, gameName: "Men's Volleyball" },
  ];

  it("adds calendar days across month boundaries", () => {
    assert.equal(addScheduleDays("2026-10-31", 1), "2026-11-01");
    assert.equal(addScheduleDays("2026-11-01", -1), "2026-10-31");
  });

  it("resolves an event to all of its sports", () => {
    assert.deepEqual(getScheduleGameTypeIds(sports, { event: "Basketball", sportId: 3 }), [1, 2]);
    assert.deepEqual(getScheduleGameTypeIds(sports, { event: "Chess", sportId: null }), []);
    assert.deepEqual(getScheduleGameTypeIds(sports, { event: null, sportId: 3 }), [3]);
    assert.equal(getScheduleGameTypeIds(sports, { event: null, sportId: null }), null);
  });

  it("treats only fully loaded days as loaded", () => {
    const oldest = game({ startDate: "2026-10-10T03:00:00Z" });
    const newest = game({ startDate: "2026-10-20T03:00:00Z" });
    const range = getScheduleLoadedRange(today, oldest, newest, true, true);
    assert.equal(isScheduleDateLoaded(range, "2026-10-10"), false);
    assert.equal(isScheduleDateLoaded(range, "2026-10-11"), true);
    assert.equal(isScheduleDateLoaded(range, "2026-10-19"), true);
    assert.equal(isScheduleDateLoaded(range, "2026-10-20"), false);
  });

  it("keeps the anchor loaded before either side has games", () => {
    const range = getScheduleLoadedRange(today, undefined, undefined, true, true);
    assert.equal(isScheduleDateLoaded(range, today), true);
    assert.equal(isScheduleDateLoaded(range, "2026-10-14"), false);
  });

  it("is unbounded on a side with no more pages", () => {
    const range = getScheduleLoadedRange(today, undefined, undefined, false, false);
    assert.equal(isScheduleDateLoaded(range, "2020-01-01"), true);
    assert.equal(isScheduleDateLoaded(range, "2030-01-01"), true);
  });
});
