import { Game, GameType, Team } from "@prisma/client"
import { SchoolRank } from "./columns"

type TeamWithSchool = Team & {
  teamSchools: {
    school: { schoolName: string }
  }[]
}

type GameWithRelations = Game & {
  gameType: GameType
  teamA: TeamWithSchool
  teamB: TeamWithSchool
  winner?: TeamWithSchool | null
}

export function transformGamesToSchoolRank(
  games: GameWithRelations[]
): SchoolRank[] {
  const leaderboard: Record<
    string,
    { schoolName: string; wins: number; losses: number; sport: string }
  > = {}

  for (const g of games) {
    const sport = g.gameType?.gameName ?? "Unknown Sport"

    // Safely get school names
    const schoolA = g.teamA.teamSchools[0]?.school.schoolName ?? g.teamA.teamName
    const schoolB = g.teamB.teamSchools[0]?.school.schoolName ?? g.teamB.teamName
    const winnerSchool =
      g.winner?.teamSchools[0]?.school.schoolName ?? g.winner?.teamName

    // Team A entry
    if (!leaderboard[`${schoolA}-${sport}`]) {
      leaderboard[`${schoolA}-${sport}`] = {
        schoolName: schoolA,
        wins: 0,
        losses: 0,
        sport,
      }
    }

    // Team B entry
    if (!leaderboard[`${schoolB}-${sport}`]) {
      leaderboard[`${schoolB}-${sport}`] = {
        schoolName: schoolB,
        wins: 0,
        losses: 0,
        sport,
      }
    }

    // Count wins/losses
    if (winnerSchool === schoolA) leaderboard[`${schoolA}-${sport}`].wins++
    else if (winnerSchool === schoolB) leaderboard[`${schoolA}-${sport}`].losses++

    if (winnerSchool === schoolB) leaderboard[`${schoolB}-${sport}`].wins++
    else if (winnerSchool === schoolA) leaderboard[`${schoolB}-${sport}`].losses++
  }

  return Object.values(leaderboard).map((entry, idx) => ({
    id: idx + 1,
    schoolName: entry.schoolName,
    wins: entry.wins,
    losses: entry.losses,
    winPercentage:
      entry.wins + entry.losses > 0
        ? (entry.wins / (entry.wins + entry.losses)) * 100
        : 0,
    sport: entry.sport,
  }))
}
