import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table"

const ranking = [
  {
    rank: 2,
    team: "SOE",
    win_ratio: 90
  },
  {
    rank: 1,
    team: "SAS",
    win_ratio: 100
  },
  {
    rank: 3,
    team: "SAFAD",
    win_ratio: 80
  },
  {
    rank: 4,
    team: "SBE",
    win_ratio: 70
  },
  {
    rank: 5,
    team: "SHCP",
    win_ratio: 60
  }
]

export function TeamRankingsTable() {
  return (
    <Table>
      <TableCaption>USC Days 2024</TableCaption>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Wins Ratio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ranking.toSorted((a, b) => a.rank - b.rank).map((t) => (
          <TableRow key={t.team}>
            <TableCell className="font-medium">{t.rank}</TableCell>
            <TableCell>{t.team}</TableCell>
            <TableCell>{t.win_ratio} %</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
