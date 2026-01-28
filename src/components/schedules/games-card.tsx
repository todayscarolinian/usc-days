import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { sportIcons } from "@/src/constants/sportIcons";
import { schoolLogos } from "@/src/constants/schoolLogos";
import { format } from "date-fns";
import Image from "next/image";
import { Schedules } from "@/src/types/types";

type ScheduleCardProps = {
  game: Schedules;
  onOpen?: (g: Schedules) => void;
};

export function GameCard({ game, onOpen }: ScheduleCardProps) {
  const start = new Date(game.startDate);

  return (
    <Card
      className="w-full p-0 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring hover:shadow-lg transition-shadow hover:bg-gray-50"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(game)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.(game);
        }
      }}
    >
      <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_1fr] p-4 mt-4">
        <CardHeader className="col-span-1 flex items-center p-0">
          <CardTitle>
            <span className="text-lg md:text-2xl font-semibold">
              {format(start, "h:mm")}
            </span>
            <span className="text-xs sm:text-base text-gray-600 font-normal">
              {format(start, "a")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="col-span-1 flex justify-center items-center p-0">
          <div className="flex justify-center gap-2 sm:gap-6 items-center text-center">
            <div className="flex justify-center gap-3 md:gap-4 items-center text-sm md:text-base">
              {game.teamA.teamName}
              <Image
                src={schoolLogos["Default"].src}
                alt={`${game.teamA.teamName} logo`}
                width={24}
                height={24}
              />
            </div>
            {Number(game.teamAScore) && Number(game.teamBScore) ? (
              <div className="flex gap-2">
                <span
                  className={
                    game.winnerId === game.teamA.id
                      ? "font-bold"
                      : "text-gray-400"
                  }
                >
                  {Number(game.teamAScore)}
                </span>
                <span>
                  <b>/</b>
                </span>
                <span
                  className={
                    game.winnerId === game.teamB.id
                      ? "font-bold"
                      : "text-gray-400"
                  }
                >
                  {Number(game.teamBScore)}
                </span>
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">No score yet</p>
            )}
            <div className="flex justify-center gap-1 md:gap-2 items-center text-sm md:text-base">
              <Image
                src={schoolLogos["Default"].src}
                alt={`${game.teamB.teamName} logo`}
                width={24}
                height={24}
              />
              {game.teamB.teamName}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="grid grid-cols-[auto_auto_1fr] md:grid-cols-[1fr_auto_1fr] bg-[#C02D2D] text-xs text-white py-2 px-2">
        <div className="col-span-1 flex items-center">
          <Image
            src={
              (sportIcons[game.gameType.gameName] || sportIcons["Default"]).src
            }
            alt={`${game.gameType.gameName} icon`}
            width={20}
            height={20}
            className={`mr-1 size-6 ${
              sportIcons[game.gameType.gameName] ? "invert" : ""
            }`}
          />
          <span>{game.gameType.gameName.toUpperCase()}</span>
        </div>
        <p className="col-span-2 text-right md:col-span-1 md:text-center">
          {(game.location ?? "TBA").toUpperCase()}
        </p>
      </CardFooter>
    </Card>
  );
}
