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
  const teamA = game.teamA?.teamName ?? "TBD";
  const teamB = game.teamB?.teamName ?? "TBD";
  const sport = game.gameType.gameName;
  const time = format(start, "h:mm a");
  const gameStatus = ongoing ? "LIVE" : status ? "UPCOMING" : "FINAL";
  const logoA = getLogoForSchool(teamA);
  const logoB = getLogoForSchool(teamB);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onOpen(game)}
      aria-label={`View ${sport}: ${teamA} vs ${teamB}, ${location}, ${format(start, "MMMM d, h:mm a")}${status ? `, ${status.toLowerCase()}` : ""}`}
      className={cn(
        "block w-full min-w-0 cursor-pointer rounded-none border bg-white text-left whitespace-normal text-[#171717] shadow-none transition-none hover:bg-white hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400 dark:hover:bg-white dark:hover:text-[#171717]",
        compact
          ? "h-[78px] border-[#dedbd6] p-3"
          : cn(
              "h-[216px] p-4 sm:p-[17px]",
              ongoing
                ? "border-[#ed4545] bg-[#fff9f8] hover:bg-[#fff9f8] dark:hover:bg-[#fff9f8]"
                : "border-[#dedbd6]",
            ),
      )}
    >
      {compact ? (
        <span className="flex h-full min-w-0 flex-col">
          <span className="flex min-w-0 items-center justify-between gap-2 text-[10px] leading-3">
            <span className="min-w-0 truncate font-bold uppercase" title={sport}>
              {sport}
            </span>
            <span className="min-w-0 truncate text-right text-black/60" title={location}>
              {location}
            </span>
          </span>
          <span className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 pt-1">
            <span className="flex min-w-0 items-center gap-2">
              <Image src={logoA} alt="" width={22} height={22} className="size-[22px] shrink-0 object-contain" />
              <span className="min-w-0 truncate text-sm leading-4 font-bold" title={teamA}>
                {teamA}
              </span>
            </span>
            <span className="text-[10px] leading-none font-medium text-black/65">vs</span>
            <span className="flex min-w-0 items-center justify-end gap-2">
              <span className="min-w-0 truncate text-right text-sm leading-4 font-bold" title={teamB}>
                {teamB}
              </span>
              <Image src={logoB} alt="" width={22} height={22} className="size-[22px] shrink-0 object-contain" />
            </span>
          </span>
        </span>
      ) : (
        <span className="flex h-full min-w-0 flex-col">
          <span className="flex items-center justify-between gap-2 text-xs leading-4 font-bold">
            <span className="min-w-0 truncate uppercase" title={sport}>
              {sport}
            </span>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 px-1.5 py-1 text-[9px] leading-none font-bold",
                ongoing ? "bg-[#e52d32] text-white" : "bg-[#f0efec] text-[#5d5b58]",
              )}
            >
              {ongoing && <span aria-hidden="true" className="size-2 rounded-full bg-white" />}
              {gameStatus}
            </span>
          </span>

          <span className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-1 sm:px-3">
            <span className="flex min-w-0 flex-col items-center justify-center gap-1.5">
              <Image src={logoA} alt="" width={44} height={44} className="size-10 shrink-0 object-contain" />
              <span className="max-w-full truncate text-xl leading-6 font-extrabold sm:text-[28px]" title={teamA}>
                {teamA}
              </span>
            </span>
            <span className="self-center text-xs leading-none font-bold text-black/60">vs</span>
            <span className="flex min-w-0 flex-col items-center justify-center gap-1.5">
              <Image src={logoB} alt="" width={44} height={44} className="size-10 shrink-0 object-contain" />
              <span className="max-w-full truncate text-xl leading-6 font-extrabold sm:text-[28px]" title={teamB}>
                {teamB}
              </span>
            </span>
          </span>

          <span className="flex items-center justify-between gap-2 border-t border-[#dedbd6] pt-2 text-xs leading-4 font-medium text-[#62605d]">
            <span className="min-w-0 truncate" title={location}>{location}</span>
            <span className="shrink-0 text-sm font-bold text-[#171717]">{time}</span>
          </span>
        </span>
      )}
    </Button>
  );
}
