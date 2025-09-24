import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Schedules } from "@/types/types"
import { sportIcons } from "@/components/schedules/columns";
import { format } from "date-fns"

type ScheduleCardProps = {
  game: Schedules;
};

export function GameCard({ game }: ScheduleCardProps) {
  const start = new Date(game.startDate);

  return (
    <Card className="w-full p-0 overflow-hidden">
      <div className="grid grid-cols-3 p-4 mt-4">
        <CardHeader className="col-span-1 flex items-center p-0">
          <CardTitle className="text-base font-semibold">
            {format(start, "h:mm a")}
          </CardTitle>
        </CardHeader>
        <CardContent className="col-span-2 p-0 lg:col-span-1">
          <div className="flex justify-center gap-6 items-center">
            <span className="font-medium">{game.teamA.teamName}</span>
            {game.score ? (
              <div className="flex gap-2">
                <span className={game.score.teamAScore > game.score.teamBScore ? "font-bold" : "text-gray-400"}>
                  {game.score.teamAScore}
                </span>
                <span><b>/</b></span>
                <span className={game.score.teamBScore > game.score.teamAScore ? "font-bold" : "text-gray-400"}>
                  {game.score.teamBScore}
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No score yet</p>
            )}
            <span className="font-heavy">{game.teamB.teamName}</span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="grid grid-cols-3 bg-[#C02D2D] text-sm text-white py-2 px-4">
        <div className="col-span-1 flex items-center">
          <div className="mr-2 size-6 brightness-0 invert">
            {sportIcons[game.gameType.gameName] ?? null}
          </div>
          <span>{game.gameType.gameName.toUpperCase()}</span>
        </div>
        <p className="col-span-1 text-center">{(game.location ?? "TBA").toUpperCase()}</p>
      </CardFooter>
    </Card>
  )
}
