import { SchoolRank } from "@/components/leaderboards/columns";

export function transformGamesToSchoolRank(games: any[]): SchoolRank[] {
  const leaderboard: Record<string, { schoolName: string; wins: number; losses: number; sport: string }> = {}

  for (const g of games) {
    const sport = g.gameType?.gameName ?? "Unknown Sport"

    // Teeam A
    const schoolA = g.teamA?.teamSchools?.[0]?.school?.schoolName ?? g.teamA.teamName
    if (!leaderboard[`${schoolA}-${sport}`]) {
      leaderboard[`${schoolA}-${sport}`] = {
        schoolName: schoolA,
        wins: 0,
        losses: 0,
        sport,
      }
    }
    if (g.winnerId === g.teamA.id) leaderboard[`${schoolA}-${sport}`].wins++
    else if (g.winnerId === g.teamB.id) leaderboard[`${schoolA}-${sport}`].losses++

    // Team B
    const schoolB = g.teamB?.teamSchools?.[0]?.school?.schoolName ?? g.teamB.teamName
    if (!leaderboard[`${schoolB}-${sport}`]) {
      leaderboard[`${schoolB}-${sport}`] = {
        schoolName: schoolB,
        wins: 0,
        losses: 0,
        sport,
      }
    }
    if (g.winnerId === g.teamB.id) leaderboard[`${schoolB}-${sport}`].wins++
    else if (g.winnerId === g.teamA.id) leaderboard[`${schoolB}-${sport}`].losses++
  }

  // return schools grouped by sport
  return Object.values(leaderboard).map((entry, idx) => ({
    id: idx + 1,
    schoolName: entry.schoolName,
    wins: entry.wins,
    losses: entry.losses,
    winPercentage:
      entry.wins + entry.losses > 0 ? (entry.wins / (entry.wins + entry.losses)) * 100 : 0,
    sport: entry.sport,
  }))
}

export default transformGamesToSchoolRank;