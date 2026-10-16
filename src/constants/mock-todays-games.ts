import { Prisma } from "@/src/lib/prisma/generated/browser";
import type { Schedules } from "@/src/types/types";

const schoolNames = ["SOE", "SAFAD", "SLG", "SED", "SHCP", "SBE", "SAS"];

type MockFixture = {
  sport: string;
  home: string;
  away: string;
  location: string;
  startsIn: number;
  score?: [number, number];
};

function createTeam(name: string): NonNullable<Schedules["teamA"]> {
  const id = schoolNames.indexOf(name) + 1;
  return {
    id,
    teamName: name,
    schoolId: id,
    school: { id, schoolName: name },
  };
}

const fixtures: MockFixture[] = [
  { sport: "Volleyball", home: "SOE", away: "SAS", location: "Downtown Court", startsIn: -30 },
  { sport: "Basketball", home: "SOE", away: "SAS", location: "Downtown Court", startsIn: 60 },
  { sport: "Basketball", home: "SOE", away: "SAS", location: "Downtown Court", startsIn: 120 },
  { sport: "Tennis", home: "SHCP", away: "SAFAD", location: "BCT Gym", startsIn: 180 },
  { sport: "Tennis", home: "SHCP", away: "SAFAD", location: "BCT Gym", startsIn: 240 },
  { sport: "Tennis", home: "SHCP", away: "SAFAD", location: "BCT Gym", startsIn: 300 },
  { sport: "Tennis", home: "SHCP", away: "SAFAD", location: "BCT Gym", startsIn: 360 },
];

/** Local preview fixtures; negative IDs keep them distinct from stored games. */
export function createMockTodaysGames(now: Date): Schedules[] {
  return fixtures.map((fixture, index) => {
    const teamA = createTeam(fixture.home);
    const teamB = createTeam(fixture.away);
    const startDate = new Date(now.getTime() + fixture.startsIn * 60_000);
    const winner = fixture.score ? teamA : null;

    return {
      id: -(index + 1),
      gameTypeId: index + 1,
      gameType: { id: index + 1, gameName: fixture.sport },
      teamAId: teamA.id,
      teamBId: teamB.id,
      teamA,
      teamB,
      location: fixture.location,
      startDate,
      endDate: new Date(startDate.getTime() + 90 * 60_000),
      createdAt: now,
      createdByHeraldId: null,
      teamAScore: fixture.score ? new Prisma.Decimal(fixture.score[0]) : null,
      teamBScore: fixture.score ? new Prisma.Decimal(fixture.score[1]) : null,
      winnerId: winner?.id ?? null,
      winner,
      teamAForfeited: false,
      teamBForfeited: false,
      isDraw: false,
    };
  });
}
