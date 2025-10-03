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
  onOpenGame?: (g: Schedules) => void;
};

export function SchedulesCard({ date, games, onOpenGame }: ScheduleCardProps) {
  const parsedDate = new Date(date);
  const isToday = format(parsedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Card className="w-full py-4">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold">
          {format(parsedDate, "MMM d, yyyy").toUpperCase()}
        </CardTitle>
        <p className="text-sm md:text-base text-gray-500">
          {format(parsedDate, "EEEE").toUpperCase()}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {games.length > 0 ? (
            games.map((game) => <GameCard key={game.id} game={game} onOpen={onOpenGame} />)
        ) : isToday ? (
            <p className="text-gray-500 text-sm text-center">
                There's no games for today.
            </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
