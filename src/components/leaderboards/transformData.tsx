import { Game } from "@prisma/client";
import { SchoolRank } from "./columns";

type GameWithRelations = Game & {
    gameType: {
        gameName: string;
        id: number;
    };
    teamA: {
        teamName: string;
        id: number;
    };
    teamB: {
        teamName: string;
        id: number;
    };
};

export function transformGamesToSchoolRank(
    games: GameWithRelations[],
    sportId: number
): SchoolRank[] {
    const leaderboard: Record<
        string,
        { schoolName: string; wins: number; losses: number; sport: string }
    > = {};

    games = games.filter((g) => g.gameType.id === sportId);

    for (const g of games) {
        const sport = g.gameType.gameName;

        // Safely get school names
        const schoolA = g.teamA.teamName;
        const schoolB = g.teamB.teamName;
        const winnerSchool =
            g.winnerId === g.teamA.id
                ? schoolA
                : g.winnerId === g.teamB.id
                ? schoolB
                : null;

        if (!schoolA || !schoolB || !winnerSchool) continue; // Skip if any school name is missing or no winner

        // Team A entry
        if (!leaderboard[`${schoolA}-${sport}`]) {
            leaderboard[`${schoolA}-${sport}`] = {
                schoolName: schoolA,
                wins: 0,
                losses: 0,
                sport,
            };
        }
        // Team A entry
        if (!leaderboard[`${schoolA}-${sport}`]) {
            leaderboard[`${schoolA}-${sport}`] = {
                schoolName: schoolA,
                wins: 0,
                losses: 0,
                sport,
            };
        }

        // Team B entry
        if (!leaderboard[`${schoolB}-${sport}`]) {
            leaderboard[`${schoolB}-${sport}`] = {
                schoolName: schoolB,
                wins: 0,
                losses: 0,
                sport,
            };
        }
        // Team B entry
        if (!leaderboard[`${schoolB}-${sport}`]) {
            leaderboard[`${schoolB}-${sport}`] = {
                schoolName: schoolB,
                wins: 0,
                losses: 0,
                sport,
            };
        }

        // Count wins/losses
        if (winnerSchool === schoolA) {
            leaderboard[`${schoolA}-${sport}`].wins++;
            leaderboard[`${schoolB}-${sport}`].losses++;
        } else if (winnerSchool === schoolB) {
            leaderboard[`${schoolA}-${sport}`].losses++;
            leaderboard[`${schoolB}-${sport}`].wins++;
        }
    }

    return Object.values(leaderboard)
        .map((entry, idx) => ({
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
        .sort((a, b) => b.winPercentage - a.winPercentage);
}
