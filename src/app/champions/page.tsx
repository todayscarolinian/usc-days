import { DataTable } from "@/components/data-table";
import { championColumns } from "@/components/columns";
import { mockChampionsData } from "@/constants/mockData";

const Champions = () => {
  return (
    <div>
      <DataTable columns={championColumns} data={mockChampionsData} />
    </div>
  )
}

export default Champions;