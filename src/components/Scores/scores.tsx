import { scoreColumns } from "@/components/Scores/columns"
import { DataTable } from "@/components/Scores/score-table"

// Currently static data. To be Fetched from the db using the api
import { mockScoresData } from "@/constants/mockData"

export default function Scores() {
  return (
    <div className="p-4 sm:p-10">
      <DataTable columns={scoreColumns} data={mockScoresData} />
    </div>
  )
}
