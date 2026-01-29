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

const swimmingAliases = [
  "Freestyle",
  "Backstroke",
  "Butterfly",
  "Breaststroke",
  "Medley",
  "Relay",
];

const getIconFor = (name: string) => {
  if (swimmingAliases.some((alias) => name.includes(alias))) {
    return sportIcons["Swimming"];
  }

  const key = Object.keys(sportIcons).find((k) => name.includes(k));

  return key ? sportIcons[key] : sportIcons["Default"];
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
      <div className="flex flex-col md:flex-row md:items-center p-4 mt-4 gap-2 md:gap-0">
        <CardHeader className="p-0 mb-2 md:mb-0 md:pl-12 flex flex-row md:flex-col items-center justify-center">
          <CardTitle className="flex items-center md:gap-1">
            <span className="text-lg md:text-2xl font-semibold">
              {format(start, "h:mm")}
            </span>
            <span className="text-xs sm:text-base text-gray-600 font-normal">
              {format(start, "a")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex justify-center items-center p-0">
          <div className="flex justify-center gap-2 sm:gap-6 items-center text-center w-full">
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
            src={getIconFor(game.gameType.gameName)}
            alt={`${game.gameType.gameName} icon`}
            width={20}
            height={20}
            className={`mr-1 invert size-6`}
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
