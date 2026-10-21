import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { GAME_STATUS_LABELS, getGameStatus } from "@/src/lib/game-status";
import { scheduleTimeFormatter } from "@/src/lib/schedules";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";
import { isMultiTeam, ordinal, participatingTeams, sortedParticipants } from "@/src/lib/multi-team";
import ScheduleLabel from "./schedule-label";
import PlacingMedal from "./placing-medal";

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

const MAX_LINEUP_LOGOS = 8;

/** Podium by team (every entry ranked 1–3) once finished; otherwise each competing team's logo once. */
function MultiTeamLineup({ game, finished, featured }: { game: Schedules; finished: boolean; featured: boolean }) {
  const podium = sortedParticipants(game).filter(p => p.rank != null && p.rank <= 3);
  const teams = participatingTeams(game);

  if (finished && podium.length > 0) {
    return (
      <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {podium.map(({ id, team, rank }) => (
          <span key={id} className="flex min-w-0 items-center gap-2">
            <PlacingMedal rank={rank} />
            <span className="sr-only">{rank != null && ordinal(rank)}</span>
            <Image src={getLogoForSchool(team.teamName)} alt="" width={36} height={36} className="size-8 shrink-0 object-contain sm:size-9" />
            <span className={cn("min-w-0 leading-tight font-bold uppercase", featured ? "text-lg sm:text-xl" : "text-sm sm:text-base")}>
              {team.teamName}
            </span>
          </span>
        ))}
      </span>
    );
  }

  if (teams.length === 0) {
    return (
      <span className={cn("font-bold uppercase", featured ? "text-lg sm:text-2xl" : "text-sm sm:text-xl")}>
        Teams TBD
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {teams.slice(0, MAX_LINEUP_LOGOS).map(team => (
        <Image key={team.id} src={getLogoForSchool(team.teamName)} alt="" width={36} height={36} className="size-8 shrink-0 object-contain sm:size-9" />
      ))}
      {teams.length > MAX_LINEUP_LOGOS && (
        <span className="flex size-8 items-center justify-center rounded-full bg-neutral-300 text-xs font-bold sm:size-9">
          +{teams.length - MAX_LINEUP_LOGOS}
        </span>
      )}
    </span>
  );
}

function multiTeamSummary(game: Schedules, finished: boolean) {
  const winners = [...new Set(game.participants.filter(p => p.rank === 1).map(p => p.team.teamName))];
  if (finished && winners.length > 0) return `1st: ${winners.join(", ")}`;
  const teams = participatingTeams(game).map(team => team.teamName);
  return teams.length > 0 ? teams.join(", ") : "Teams TBD";
}

export default function ScheduleMatch({ game, now, showEventLabel, canManage, onEditScore, onEditSchedule }: ScheduleMatchProps) {
  const status = getGameStatus(game, now);
  const featured = status === "live";
  const multiTeam = isMultiTeam(game);
  const statusLabel = GAME_STATUS_LABELS[status];
  const time = scheduleTimeFormatter.format(new Date(game.startDate));
  const location = game.location?.trim() || "Location TBA";
  const showScores = game.teamAScore != null || game.teamBScore != null ||
    game.teamAForfeited || game.teamBForfeited;
  const homeScore = game.teamAForfeited ? "X" : String(game.teamAScore ?? "–");
  const awayScore = game.teamBForfeited ? "X" : String(game.teamBScore ?? "–");
  const matchup = multiTeam
    ? multiTeamSummary(game, status === "finished")
    : `${game.teamA?.teamName ?? "TBD"} vs ${game.teamB?.teamName ?? "TBD"}`;
  const editResultLabel = multiTeam ? "Edit results" : "Edit score";

  return (
    <article
      id={`schedule-match-${game.id}`}
      tabIndex={-1}
      aria-label={`${game.gameType.gameName}: ${matchup}, ${time}, ${location}, ${statusLabel}${game.label ? `, ${game.label}` : ""}`}
      className={cn(
        "block w-full min-w-0 select-none overflow-hidden bg-neutral-100 text-center text-sm font-medium text-[#171717] focus:outline-2 focus:outline-offset-4 focus:outline-tc_primary-400 motion-safe:transition-colors",
        featured && "border-t-2 border-tc_primary-400",
      )}
    >
      {canManage && game.id > 0 && (
        <div className="flex items-center justify-end gap-2 px-3 py-2">
          {canManage && game.id > 0 && (
            <Button className="cursor-pointer" size="sm" variant="outline" onClick={() => onEditSchedule(game)}>Edit schedule</Button>
          )}
          <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onEditScore(game)} aria-label={`${editResultLabel} for ${matchup}`}>
            {editResultLabel}
          </Button>
        </div>
      )}
      <Link
        href={`/schedules/${game.id}`}
        aria-label={`View ${game.gameType.gameName}: ${matchup}, ${time}, ${location}, ${statusLabel}${game.label ? `, ${game.label}` : ""}`}
        className="block w-full cursor-pointer hover:bg-neutral-200/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tc_primary-400 motion-safe:transition-colors"
      >
      {game.label && (
        <span className="block px-3 pt-3"><ScheduleLabel label={game.label} /></span>
      )}
      {featured ? (
        <span className="block p-3 sm:p-5">
          <span className="flex items-center justify-between gap-3 text-xs">
            <span className="bg-tc_primary-400 px-2 py-1 text-white uppercase">Live</span>
            <span className="min-w-0 text-right text-neutral-600">{location}</span>
          </span>
          {multiTeam ? (
            <span className="mt-5 flex flex-col items-center gap-2">
              <MultiTeamLineup game={game} finished={false} featured />
              <span className="text-sm font-normal text-tc_primary-500">{time}</span>
            </span>
          ) : (
            <span className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <MatchTeam team={game.teamA} side="home" featured />
              <span className="flex flex-col text-2xl font-bold">
                {showScores ? `${homeScore} – ${awayScore}` : "VS"}
                <span className="text-sm font-normal text-tc_primary-500">{time}</span>
              </span>
              <MatchTeam team={game.teamB} side="away" featured />
            </span>
          )}
          {showEventLabel && (
            <span className="mt-4 block text-sm text-neutral-600">{game.gameType.gameName}</span>
          )}
        </span>
      ) : (
        <>
          {multiTeam ? (
            <span className="flex min-h-20 items-center justify-center px-2 py-4 sm:px-5">
              <MultiTeamLineup game={game} finished={status === "finished"} featured={false} />
            </span>
          ) : (
            <span className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 py-4 sm:gap-5 sm:px-5">
              <MatchTeam team={game.teamA} side="home" featured={false} />
              <span className="flex items-center gap-2 text-base sm:gap-5 sm:text-xl">
                {showScores && <span>{homeScore}</span>}
                <span className="text-neutral-500">/</span>
                {showScores && <span>{awayScore}</span>}
              </span>
              <MatchTeam team={game.teamB} side="away" featured={false} />
            </span>
          )}
          <span className={cn(
            "grid items-center gap-2 bg-tc_primary-400 px-3.5 py-2 text-sm text-white sm:text-base",
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
      </Link>
    </article>
  );
}
