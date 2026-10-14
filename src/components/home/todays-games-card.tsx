import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { getMatchdayGameStatus } from "@/src/lib/todays-games";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";

type TodaysGamesCardProps = {
  game: Schedules;
  now: Date;
  compact?: boolean;
  onOpen: (game: Schedules) => void;
};

export function TodaysGamesCard({
  game,
  now,
  compact = false,
  onOpen,
}: TodaysGamesCardProps) {
  const start = new Date(game.startDate);
  const status = getMatchdayGameStatus(game, now);
  const ongoing = status === "ONGOING";
  const location = game.location?.trim() || "TBA";
  const teamA = game.teamA.teamName;
  const teamB = game.teamB.teamName;
  const sport = game.gameType.gameName;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onOpen(game)}
      aria-label={`View ${sport}: ${teamA} vs ${teamB}, ${location}, ${format(start, "MMMM d, h:mm a")}${status ? `, ${status.toLowerCase()}` : ""}`}
      className={cn(
        "block w-full min-w-0 cursor-pointer rounded-none bg-white text-left whitespace-normal text-[#171717] shadow-none transition-none hover:bg-white hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400 dark:hover:bg-white dark:hover:text-[#171717]",
        compact ? "h-[93px] border border-[#171717] p-2.5" : "h-[220px] p-2.5",
      )}
    >
      <span
        className={cn(
          "flex h-full min-w-0 flex-col",
          !compact && "border",
          !compact && (ongoing ? "border-tc_primary-400" : "border-[#171717]"),
        )}
      >
        {compact ? (
          <span className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 border-b border-[#171717] py-1 font-medium leading-5">
            <span className="truncate text-sm" title={sport}>
              {sport}
            </span>
            <span
              className="truncate text-center text-xs text-black/75"
              title={location}
            >
              {location}
            </span>
            <span className="whitespace-nowrap text-xs text-black/75">
              {format(start, "MMMM d, yyyy")}
            </span>
          </span>
        ) : (
          <span className="flex items-center justify-between gap-3 px-3 pt-7 pb-2.5 text-base leading-[22px] font-medium">
            <span className="min-w-0 truncate uppercase" title={sport}>
              {sport}
            </span>
            <span
              className={cn(
                "shrink-0",
                ongoing ? "text-[#BE0000]" : "text-black/65",
              )}
            >
              {status}
            </span>
          </span>
        )}

        <span
          className={cn(
            "grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 font-medium",
            compact
              ? "px-2.5 text-sm leading-5"
              : "px-3 pb-2 text-[28px] leading-10 min-[375px]:text-[36px] min-[1400px]:text-[48px]",
          )}
        >
          <span
            className={cn(
              "flex min-w-0 items-center",
              compact ? "gap-1" : "gap-2",
            )}
          >
            <span className="min-w-0 truncate" title={teamA}>
              {teamA}
            </span>
            <Image
              src={getLogoForSchool(teamA)}
              alt=""
              width={compact ? 40 : 68}
              height={compact ? 40 : 68}
              className={cn(
                "shrink-0 object-contain",
                compact
                  ? "size-10"
                  : "size-11 min-[375px]:size-[52px] min-[1400px]:size-[68px]",
              )}
            />
          </span>
          <span className={compact ? "text-xs" : "text-sm"}>
            {compact ? "VS" : "vs"}
          </span>
          <span
            className={cn(
              "flex min-w-0 items-center justify-end",
              compact ? "gap-1" : "gap-2",
            )}
          >
            <Image
              src={getLogoForSchool(teamB)}
              alt=""
              width={compact ? 40 : 68}
              height={compact ? 40 : 68}
              className={cn(
                "shrink-0 object-contain",
                compact
                  ? "size-10"
                  : "size-11 min-[375px]:size-[52px] min-[1400px]:size-[68px]",
              )}
            />
            <span className="min-w-0 truncate text-right" title={teamB}>
              {teamB}
            </span>
          </span>
        </span>

        {!compact && (
          <span
            className="truncate border-t-2 border-[#171717] px-3 py-1 text-sm leading-5 font-medium text-black/55"
            title={`${location} · ${format(start, "h:mma").toLowerCase()}`}
          >
            {location} · {format(start, "h:mma").toLowerCase()}
          </span>
        )}
      </span>
    </Button>
  );
}
