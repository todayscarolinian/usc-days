import { scoreColumns } from "./columns"
import { DataTable } from "./data-table"
import { mockScoresData } from "@/constants/mockData"

async function getData() {
  // Fetch data from your API here.
  return mockScoresData
}

export default async function Scores() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={scoreColumns} data={data} />
    </div>
  )
}
