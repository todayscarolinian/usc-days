import { scoreColumns } from "@/components/champions/columns"
import { DataTable } from "@/components/champions/score-table"

// Currently static data. To be Fetched from the db using the api
import { mockScoresData } from "@/constants/mockData"

export default function Champions() {
  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable columns={scoreColumns} data={mockScoresData} />
      </div>
    </div>
  )
}
