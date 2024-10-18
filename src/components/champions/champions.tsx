import { DataTable } from "@/components/champions/champions-table";
import { championColumns } from "@/components/champions/columns";
import { mockChampionsData } from "@/constants/mockData";
import AddChampionDialog from "@/components/ActionButtons/AddChampionDialog";

export default function Champions() {
  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable
          columns={championColumns}
          data={mockChampionsData}
          actionButton={<AddChampionDialog />}
        />
      </div>
    </div>
  );
}
