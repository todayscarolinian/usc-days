import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import { Schedules } from "@/src/types/types";
import { getIconFor, getLogoForSchool } from "@/src/lib/utils";
import type { Decimal } from "@prisma/client/runtime/client";

type ScheduleCardProps = {
  game: Schedules;
  onOpen?: (g: Schedules) => void;
};

function formatScore(
  score: Decimal | null | undefined,
  forfeited: boolean,
): string | number {
  if (forfeited) return "X";
  if (score == null) return "-";
  return Number(score);
}

function getScoreClassName(game: Schedules, teamId: number): string {
  const bothForfeited = game.teamAForfeited && game.teamBForfeited;

  // Show as winner (bold) if this team won or it's a draw
  const isWinner = game.winnerId === teamId || game.isDraw;

  if (isWinner && !bothForfeited) {
    return "font-bold";
  }

  return "text-gray-400";
}

function hasGameResult(game: Schedules): boolean {
  return !!(
    game.winnerId ||
    game.teamAForfeited ||
    game.teamBForfeited ||
    game.isDraw
  );
}

export function GameCard({ game, onOpen }: ScheduleCardProps) {
  const start = new Date(game.startDate);

  return (
    <Card
      className="w-full p-0 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring hover:shadow-md transition-all hover:bg-neutral-50 border-neutral-200"
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
      <div
        id="card-content"
        className="flex flex-col p-4 mt-4 gap-2 md:grid md:grid-cols-4 md:gap-0"
      >
        <CardHeader className="p-0 md:col-span-1 mb-2 md:mb-0 flex flex-row md:flex-col justify-center">
          <CardTitle className="flex items-center gap-1">
            <span className="text-lg md:text-2xl font-semibold">
              {format(start, "h:mm")}
            </span>
            <span className="text-xs sm:text-base text-gray-600 font-normal">
              {format(start, "a")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="col-span-2 w-full flex-1 flex justify-center items-center p-0">
          <div className="gap-2 md:gap-6 justify-center items-center text-center w-full grid grid-cols-5 md:grid-cols-5">
            <div className="flex justify-end gap-3 md:gap-4 items-center text-sm md:text-base col-span-2 md:col-span-2">
              {game.teamA.teamName}
              <Image
                src={getLogoForSchool(game.teamA.teamName).src}
                alt={`${game.teamA.teamName} logo`}
                width={24}
                height={24}
              />
            </div>
            {hasGameResult(game) ? (
              <div className="flex gap-2 justify-center">
                <span className={getScoreClassName(game, game.teamAId)}>
                  {formatScore(game.teamAScore, game.teamAForfeited)}
                </span>
                <span>
                  <b>/</b>
                </span>
                <span className={getScoreClassName(game, game.teamBId)}>
                  {formatScore(game.teamBScore, game.teamBForfeited)}
                </span>
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-500">No score yet</p>
            )}
            <div className="flex justify-start gap-1 md:gap-2 items-center text-sm md:text-base col-span-2 md:col-span-2">
              <Image
                src={getLogoForSchool(game.teamB.teamName).src}
                alt={`${game.teamB.teamName} logo`}
                width={24}
                height={24}
              />
              {game.teamB.teamName}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="grid grid-cols-1 place-items-center space-y-2 md:grid-cols-[1fr_auto_1fr] md:space-y-0 md:place-items-stretch bg-[#C02D2D] text-xs text-white py-2 px-2">
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
        <p className="col-span-2 flex items-center text-right md:col-span-1 md:text-center">
          {(game.location ?? "TBA").toUpperCase()}
        </p>
      </CardFooter>
    </Card>
  );
}
