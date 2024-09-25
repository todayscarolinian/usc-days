import { DataTable } from "@/components/Scores/score-table";
import { championColumns } from "@/components/Scores/columns";
import { mockChampionsData } from "@/constants/mockData";

const Champions = () => {
  return (
    <div>
      <DataTable columns={championColumns} data={mockChampionsData} />
    </div>
  )
}

export default Champions;