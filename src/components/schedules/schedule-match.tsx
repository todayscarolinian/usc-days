import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { GAME_STATUS_LABELS, getGameStatus } from "@/src/lib/game-status";
import { scheduleTimeFormatter } from "@/src/lib/schedules";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";

type ScheduleMatchProps = {
  showEventLabel: boolean;
  game: Schedules;
  now: Date;
  canManage: boolean;
  onEditScore: (game: Schedules) => void;
  onEditSchedule: (game: Schedules) => void;
};

type MatchTeamProps = {
  team: Schedules["teamA"];
  side: "home" | "away";
  featured: boolean;
};

function MatchTeam({ team, side, featured }: MatchTeamProps) {
  const name = team?.teamName ?? "TBD";
  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2 sm:gap-3",
        featured ? "flex-col" : side === "home" && "flex-row-reverse",
      )}
    >
      {team ? (
        <Image
          src={getLogoForSchool(name)}
          alt=""
          width={featured ? 64 : 36}
          height={featured ? 64 : 36}
          className={cn("shrink-0 object-contain", featured ? "size-16" : "size-8 sm:size-9")}
        />
      ) : (
        <span aria-hidden="true" className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-500",
          featured ? "size-16 text-2xl" : "size-8 sm:size-9",
        )}>?</span>
      )}
      <span className={cn(
        "min-w-0 leading-tight font-bold uppercase",
        featured ? "text-center text-lg sm:text-2xl" : "text-sm sm:text-xl",
        !featured && (side === "home" ? "text-right" : "text-left"),
      )}>
        {name}
      </span>
    </span>
  );
}

export default function ScheduleMatch({ game, now, showEventLabel, canManage, onEditScore, onEditSchedule }: ScheduleMatchProps) {
  const status = getGameStatus(game, now);
  const featured = status === "live";
  const statusLabel = GAME_STATUS_LABELS[status];
  const time = scheduleTimeFormatter.format(new Date(game.startDate));
  const location = game.location?.trim() || "Location TBA";
  const showScores = game.teamAScore != null || game.teamBScore != null ||
    game.teamAForfeited || game.teamBForfeited;
  const homeScore = game.teamAForfeited ? "X" : String(game.teamAScore ?? "–");
  const awayScore = game.teamBForfeited ? "X" : String(game.teamBScore ?? "–");
  const matchup = `${game.teamA?.teamName ?? "TBD"} vs ${game.teamB?.teamName ?? "TBD"}`;

  return (
    <article
      id={`schedule-match-${game.id}`}
      tabIndex={-1}
      aria-label={`${game.gameType.gameName}: ${matchup}, ${time}, ${location}, ${statusLabel}`}
      className={cn(
        "block w-full min-w-0 select-none overflow-hidden bg-neutral-100 text-center text-sm font-medium text-[#171717] focus:outline-2 focus:outline-offset-4 focus:outline-tc_primary-400 motion-safe:transition-colors",
        featured && "border-t-2 border-tc_primary-400",
      )}
    >
      {canManage && game.id > 0 && (
        <div className="flex items-center justify-end gap-2 px-3 py-2">
          {canManage && game.id > 0 && (
            <Button size="sm" variant="outline" onClick={() => onEditSchedule(game)}>Edit schedule</Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onEditScore(game)} aria-label={`Edit score for ${matchup}`}>
            Edit score
          </Button>
        </div>
      )}
      {featured ? (
        <span className="block p-3 sm:p-5">
          <span className="flex items-center justify-between gap-3 text-xs">
            <span className="bg-tc_primary-400 px-2 py-1 text-white uppercase">Live</span>
            <span className="min-w-0 text-right text-neutral-600">{location}</span>
          </span>
          <span className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
            <MatchTeam team={game.teamA} side="home" featured />
            <span className="flex flex-col text-2xl font-bold">
              VS
              <span className="text-sm font-normal text-tc_primary-500">{time}</span>
            </span>
            <MatchTeam team={game.teamB} side="away" featured />
          </span>
          {showEventLabel && (
            <span className="mt-4 block text-sm text-neutral-600">{game.gameType.gameName}</span>
          )}
        </span>
      ) : (
        <>
          <span className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 py-4 sm:gap-5 sm:px-5">
            <MatchTeam team={game.teamA} side="home" featured={false} />
            <span className="flex items-center gap-2 text-base sm:gap-5 sm:text-xl">
              {showScores && <span>{homeScore}</span>}
              <span className="text-neutral-500">/</span>
              {showScores && <span>{awayScore}</span>}
            </span>
            <MatchTeam team={game.teamB} side="away" featured={false} />
          </span>
          <span className={cn(
            "grid items-center gap-2 bg-tc_primary-400 px-3.5 py-2 text-xs text-white sm:text-sm",
            showEventLabel ? "grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]" : "grid-cols-2",
          )}>
            <span className="min-w-0 text-left">{time}</span>
            {showEventLabel && (
              <span className="min-w-0 text-center">
                {game.gameType.gameName}{status !== "upcoming" && ` · ${statusLabel}`}
              </span>
            )}
            <span title={location} className="min-w-0 truncate text-right">{location}</span>
          </span>
        </>
      )}

    </article>
  );
}
