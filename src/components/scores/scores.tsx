import { scoreColumns } from "@/components/scores/columns";
import { DataTable } from "@/components/scores/score-table";
import axios from "axios";

export default async function ScoresPage() {
  const {
    data: { games: gamesData },
  } = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/api/games");

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable columns={scoreColumns} data={gamesData} />
      </div>
    </div>
  );
}
