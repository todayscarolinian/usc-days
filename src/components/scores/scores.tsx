import { scoreColumns } from "@/components/scores/columns";
import { DataTable } from "@/components/scores/score-table";
import AddScoreDialog from "@/components/scores/add-score-dialog";
import { Scores } from "@/types/types";
import axios from "axios";

export default async function ScoresPage() {
  const {
    data: { games: data },
  } = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/api/games");

  const gamesData = data.filter((game: Scores) => game.score !== null);
    const schedulesData = data.filter((game: Scores) => {
        const now = new Date();
        const startDate = new Date(game.startDate);
        const oneDayInMillis = 24 * 60 * 60 * 1000;

    const isToday =
      startDate.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
      }) ===
      now.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
      });
        
      const isPast = (now.getTime() - startDate.getTime()) >= oneDayInMillis;

    return (isToday || isPast) && game.score === null;
  });

  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable
          columns={scoreColumns}
          data={gamesData}
          actionButton={<AddScoreDialog schedules={schedulesData} />}
        />
      </div>
    </div>
  );
}
