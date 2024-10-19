import { scoreColumns } from "@/components/scores/columns";
import { DataTable } from "@/components/scores/score-table";
import AddScoreDialog from "@/components/scores/add-score-dialog";
import { Scores } from "@/types/types";
import axios from "axios";

export default async function ScoresPage() {
    const {
        data: { games: data },
    } = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/api/games");

    console.log("SCORES DATA: ", data);

    const gamesData = data.filter((game: Scores) => game.score !== null);
    const schedulesData = data.filter((game: Scores) => {
        const now = new Date();
        const startDate = new Date(game.startDate);
        const isFuture = now.getTime() - startDate.getTime() <= 0;
        return !isFuture && game.score === null; // games that are not yet ongoing and dont have a score
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
