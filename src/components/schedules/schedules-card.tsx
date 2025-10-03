import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GameCard } from "./games-card";
import { Schedules } from "@/types/types"
import { format } from "date-fns"

type ScheduleCardProps = {
  date: string;
  games: Schedules[];
};

export function SchedulesCard({ date, games }: ScheduleCardProps) {
  const parsedDate = new Date(date);
  const isToday = format(parsedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Card className="w-full py-4">
      <CardHeader className="flex flex-row md:flex-col">
        <CardTitle className="flex-1 text-lg md:text-2xl">
          {format(parsedDate, "MMM d, yyyy").toUpperCase()}
        </CardTitle>
        <p className="flex-1 text-right text-xs text-gray-500">
          {format(parsedDate, "EEEE").toUpperCase()}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {games.length > 0 ? (
            games.map((game) => <GameCard key={game.id} game={game} />)
        ) : isToday ? (
            <p className="text-gray-600 text-lg text-center mb-6">
                There's no games for today.
            </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
