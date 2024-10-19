import { DataTable } from "@/components/Scores/score-table";
import { championColumns } from "@/components/Scores/columns";
import { mockChampionsData } from "@/constants/mockData";
import AddDialog from "@/components/ActionButtons/AddDialog";

const Champions = () => {
  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable columns={championColumns} data={mockChampionsData} showFilter={false} actionButton={<AddDialog />} />
      </div>
    </div>
  );
};

export default Champions;
