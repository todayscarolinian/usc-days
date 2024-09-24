import { TeamRankingsTable } from "./team-rankings-table"
import { SelectSportButton } from "./select-sport"

export default function RankingSummaryPage() {
  return (
    <div className='p-11'>
      <div className="mb-11">
        <SelectSportButton />
      </div>
      <TeamRankingsTable />
    </div>
  )
}