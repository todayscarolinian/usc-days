import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";

interface Ranking {
  rank: number;
  team: string;
  win_ratio: number;
  school: string;
}

const mock_scores = [
  {
    id: 1,
    gameId: 1,
    teamAScore: 3,
    teamBScore: 1,
    createdAt: new Date(),
    game: {
      id: 1,
      gameTypeId: 1,
      gameType: { id: 1, gameName: "Soccer" },
      teamAId: 1,
      teamBId: 2,
      teamA: { id: 1, teamName: "SAS Majesties", schoolId: 1, school: { id: 1, schoolName: "SAS" } },
      teamB: { id: 2, teamName: "Warriors", schoolId: 2, school: { id: 2, schoolName: "SOE" } },
      date: new Date(),
      location: "Stadium 1",
    },
    createdById: 1,
    createdBy: { id: 1, email: "user1@example.com" },
  },
  {
    id: 2,
    gameId: 2,
    teamAScore: 2,
    teamBScore: 2,
    createdAt: new Date(),
    game: {
      id: 2,
      gameTypeId: 1,
      gameType: { id: 1, gameName: "Basketball" },
      teamAId: 1,
      teamBId: 3,
      teamA: { id: 1, teamName: "Money Gang", schoolId: 1, school: { id: 1, schoolName: "SBE" } },
      teamB: { id: 3, teamName: "SAS Majesties", schoolId: 3, school: { id: 3, schoolName: "SAS" } },
      date: new Date(),
      location: "Stadium 2",
    },
    createdById: 2,
    createdBy: { id: 2, email: "user2@example.com" },
  },
  {
    id: 3,
    gameId: 3,
    teamAScore: 0,
    teamBScore: 2,
    createdAt: new Date(),
    game: {
      id: 3,
      gameTypeId: 1,
      gameType: { id: 1, gameName: "Baseball" },
      teamAId: 2,
      teamBId: 3,
      teamA: { id: 2, teamName: "SAS Majesties", schoolId: 2, school: { id: 2, schoolName: "SAS" } },
      teamB: { id: 3, teamName: "Warriors", schoolId: 3, school: { id: 3, schoolName: "SOE" } },
      date: new Date(),
      location: "Stadium 3",
    },
    createdById: 3,
    createdBy: { id: 3, email: "user3@example.com" },
  },
];


function calculateRankings(scores, selectedSport: string | null): Ranking[] {
  const teamStats: Record<string, { schoolName: string; teamName: string; wins: number; totalGames: number }> = {};

  scores.forEach((score) => {
    const game = score.game; 
    if (!game || (selectedSport && game.gameType.gameName !== selectedSport)) return; 

    const teamA = game.teamA;
    const teamB = game.teamB;

    if (!teamA || !teamB) {
      console.warn("Team A or Team B is undefined for game ID:", game.id);
      return;
    }

    if (!teamStats[teamA.teamName]) {
      teamStats[teamA.teamName] = { schoolName: teamA.school.schoolName, teamName: teamA.teamName, wins: 0, totalGames: 0 };
    }
    if (!teamStats[teamB.teamName]) {
      teamStats[teamB.teamName] = { schoolName: teamB.school.schoolName, teamName: teamB.teamName, wins: 0, totalGames: 0 };
    }

    teamStats[teamA.teamName].totalGames += 1;
    teamStats[teamB.teamName].totalGames += 1;

    if (score.teamAScore > score.teamBScore) {
      teamStats[teamA.teamName].wins += 1;
    } else if (score.teamBScore > score.teamAScore) {
      teamStats[teamB.teamName].wins += 1;
    }
  });

  const rankings: Ranking[] = Object.values(teamStats).map(({ schoolName, teamName, wins, totalGames }) => ({
    school: schoolName,
    team: teamName,
    win_ratio: totalGames === 0 ? 0 : (wins / totalGames) * 100,
    rank: 0,
  }));

  rankings.sort((a, b) => b.win_ratio - a.win_ratio).forEach((rank, index) => {
    rank.rank = index + 1;
  });

  return rankings;
}

export function TeamRankingsTable({ selectedSport }: { selectedSport: string | null }) {
  // const scores = await fetch("/api/scores");
  const scores = mock_scores;
  const rankings = calculateRankings(scores, selectedSport); 
  
  if(!selectedSport){
    return <div>Select a sport.</div>
  }

  return (
    <Table>
      <TableCaption>USC Days 2024</TableCaption>
      <TableHeader className="bg-primary_600">
        <TableRow >
          <TableHead className="w-[100px] text-white font-bold">Rank</TableHead>
          <TableHead className="text-white font-bold">Team</TableHead>
          <TableHead className="text-white font-bold">Win Ratio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rankings.map((ranking) => (
          <TableRow key={ranking.team}>
            <TableCell className="font-medium">{ranking.rank}</TableCell>
            <TableCell>{ranking.team} <span className="text-gray-500">({ranking.school})</span></TableCell>
            <TableCell>{ranking.win_ratio.toFixed(2)} %</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}