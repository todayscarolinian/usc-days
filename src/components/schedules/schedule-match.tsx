import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit",
});

export default function ScheduleMatch({ game, now, featured, onOpen }: {
  game: Schedules; now: Date; featured: boolean; onOpen: () => void;
}) {
  const teamA = game.teamA?.teamName ?? "TBD";
  const teamB = game.teamB?.teamName ?? "TBD";
  const time = timeFormatter.format(new Date(game.startDate));
  const hasScores = game.teamAScore != null && game.teamBScore != null;
  const finished = hasScores || game.winnerId != null || game.isDraw || game.teamAForfeited || game.teamBForfeited;
  const status = featured ? "Live" : finished ? "Final" : new Date(game.endDate) <= now ? "Ended" : "Upcoming";
  const location = game.location?.trim() || "Location TBA";

  return (
    <Button variant="ghost" onClick={onOpen}
      aria-label={`${game.gameType.gameName}: ${teamA} vs ${teamB}, ${time}, ${location}, ${status}. View match details`}
      className={cn("block h-auto w-full min-w-0 overflow-hidden rounded-none bg-neutral-100 p-0 text-[#171717] whitespace-normal hover:bg-white focus-visible:ring-tc_primary-400", featured && "border-t-2 border-tc_primary-400")}
    >
      {featured ? <span className="block p-3 sm:p-5">
        <span className="flex items-center justify-between gap-3 text-xs uppercase">
          <span className="bg-tc_primary-400 px-2 py-1 text-white">Live</span>
          <span className="min-w-0 text-right text-neutral-600">{location}</span>
        </span>
        <span className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <span className="flex min-w-0 flex-col items-center gap-2"><Image src={getLogoForSchool(teamA)} alt="" width={64} height={64} className="size-16 object-contain" /><span className="text-lg leading-tight font-bold uppercase sm:text-2xl">{teamA}</span></span>
          <span className="flex flex-col text-2xl font-bold">VS<span className="text-sm font-normal text-tc_primary-500">{time}</span></span>
          <span className="flex min-w-0 flex-col items-center gap-2"><Image src={getLogoForSchool(teamB)} alt="" width={64} height={64} className="size-16 object-contain" /><span className="text-lg leading-tight font-bold uppercase sm:text-2xl">{teamB}</span></span>
        </span>
        <span className="mt-4 block text-sm text-neutral-600">{game.gameType.gameName}</span>
      </span> : <>
        <span className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 py-4 sm:gap-5 sm:px-5">
          <span className="flex min-w-0 items-center justify-end gap-2 sm:gap-3"><span className="text-right text-sm leading-tight font-bold uppercase sm:text-xl">{teamA}</span><Image src={getLogoForSchool(teamA)} alt="" width={36} height={36} className="size-8 shrink-0 object-contain sm:size-9" /></span>
          <span className="flex items-center gap-2 text-base sm:gap-5 sm:text-xl">{hasScores && <span>{String(game.teamAScore)}</span>}<span className="text-neutral-500">/</span>{hasScores && <span>{String(game.teamBScore)}</span>}</span>
          <span className="flex min-w-0 items-center gap-2 sm:gap-3"><Image src={getLogoForSchool(teamB)} alt="" width={36} height={36} className="size-8 shrink-0 object-contain sm:size-9" /><span className="text-left text-sm leading-tight font-bold uppercase sm:text-xl">{teamB}</span></span>
        </span>
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-tc_primary-400 px-3.5 py-2 text-xs text-white sm:text-sm">
          <span>{time}</span><span className="min-w-0 text-center uppercase">{location}</span><span>{game.gameType.gameName} · {status}</span>
        </span>
      </>}
    </Button>
  );
}
