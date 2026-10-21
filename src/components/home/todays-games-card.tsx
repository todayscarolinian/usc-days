import styles from "./todays-games.module.css";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { getMatchdayGameStatus } from "@/src/lib/todays-games";
import { isMultiTeam, participatingTeams } from "@/src/lib/multi-team";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";
import ScheduleLabel from "@/src/components/schedules/schedule-label";
import { setScoreSummary } from "@/src/lib/set-scoring";

type TodaysGamesCardProps = {
  game: Schedules;
  now: Date;
  compact?: boolean;
};

const MAX_LOGOS = { featured: 12, compact: 6 };

/** Each competing team's logo once, in place of a two-team matchup. */
function MultiTeamLogos({ game, compact }: { game: Schedules; compact: boolean }) {
  const teams = participatingTeams(game);
  const max = compact ? MAX_LOGOS.compact : MAX_LOGOS.featured;
  return (
    <span aria-hidden="true" className={cn("flex flex-wrap items-center", compact ? "gap-2" : "justify-center gap-4 sm:gap-6")}>
      {teams.slice(0, max).map(team => (
        <Image
          key={team.id}
          src={getLogoForSchool(team.teamName)}
          alt=""
          width={compact ? 30 : 80}
          height={compact ? 30 : 80}
          className={cn("shrink-0 object-contain", compact ? "size-[30px]" : "size-14 sm:size-20")}
        />
      ))}
      {teams.length > max && (
        <span className={cn("font-bold text-black/60", compact ? "text-sm" : "text-2xl")}>+{teams.length - max}</span>
      )}
    </span>
  );
}

export function TodaysGamesCard({
  game,
  now,
  compact = false,
}: TodaysGamesCardProps) {
  if (isMultiTeam(game)) return <MultiTeamGameCard game={game} now={now} compact={compact} />;

  const start = new Date(game.startDate);
  const status = getMatchdayGameStatus(game, now);
  const ongoing = status === "ONGOING";
  const showScores = ongoing && (game.teamAScore != null || game.teamBScore != null);
  const scoreA = String(game.teamAScore ?? "–");
  const scoreB = String(game.teamBScore ?? "–");
  const score = showScores ? (
    <>
      <span className={styles.scoreValue}>{scoreA}</span>{" "}
      <span className={styles.scoreSeparator}>–</span>{" "}
      <span className={styles.scoreValue}>{scoreB}</span>
    </>
  ) : null;
  const location = game.location?.trim() || "TBA";
  const teamA = game.teamA?.teamName ?? "TBD";
  const teamB = game.teamB?.teamName ?? "TBD";
  const hasLongTeamName = [teamA, teamB].some((name) =>
    name.split(/\s+/).some((word) => word.length >= 10),
  );
  const sport = game.gameType.gameName;
  const time = format(start, "h:mm a");
  const gameStatus = ongoing ? "LIVE" : status ? "UPCOMING" : "FINAL";
  const logoA = getLogoForSchool(teamA);
  const logoB = getLogoForSchool(teamB);

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(styles.card, compact ? styles.compact : styles.featured, ongoing && !compact && styles.live)}
    >
      <Link
        href={`/schedules/${game.id}`}
        aria-label={`View ${sport}: ${teamA} vs ${teamB}, ${location}, ${format(start, "MMMM d, h:mm a")}${status ? `, ${status.toLowerCase()}` : ""}${showScores ? `, score ${teamA} ${scoreA}, ${teamB} ${scoreB}` : ""}${game.label ? `, ${game.label}` : ""}`}
      >
      {compact ? (
        <span className={styles.cardContent}>
          <span className={styles.compactTop}>
            <span className="min-w-0 truncate font-bold uppercase" title={sport}>
              {sport}
            </span>
            <span className="min-w-0 truncate text-right text-black/60" title={location}>
              {location}
            </span>
          </span>
          <span className={cn(styles.compactTeams, showScores && styles.scoredMatchup)}>
            <span className="flex min-w-0 items-center gap-2">
              <Image src={logoA} alt="" width={22} height={22} className="size-[30px] shrink-0 object-contain" />
              <span className="min-w-0 truncate text-[22px] leading-[1.2] font-bold" title={teamA}>
                {teamA}
              </span>
            </span>
            <span className={cn(
              "leading-none whitespace-nowrap tabular-nums",
              showScores ? "text-[28px] font-bold text-black" : "text-[10px] font-medium text-black/65",
            )}>
              {score ?? "vs"}
            </span>
            <span className="flex min-w-0 items-center justify-end gap-2">
              <span className="min-w-0 truncate text-right text-[22px] leading-[1.2] font-bold" title={teamB}>
                {teamB}
              </span>
              <Image src={logoB} alt="" width={22} height={22} className="size-[30px] shrink-0 object-contain" />
            </span>
          </span>
          <ScheduleLabel label={game.label} />
          {setScoreSummary(game) && <span className="block text-xs font-normal text-black/60">{setScoreSummary(game)}</span>}
        </span>
      ) : (
        <span className={styles.cardContent}>
          <span className={styles.cardTop}>
            <span className="min-w-0 truncate uppercase" title={sport}>
              {sport}
            </span>
            <span
              className={cn(styles.status, ongoing && styles.liveStatus)}
            >
              {ongoing && <span aria-hidden="true" className="size-2 rounded-full bg-white" />}
              {gameStatus}
            </span>
          </span>

          <span className={cn(
            styles.matchup,
            showScores && styles.scoredMatchup,
            hasLongTeamName && styles.longTeamNames,
          )}>
            <span className={styles.team}>
              <Image src={logoA} alt="" width={106} height={106} className={styles.teamLogo} />
              <span className={styles.teamName} title={teamA}>
                {teamA}
              </span>
            </span>
            <span className={cn(styles.versus, showScores && styles.score, showScores && "whitespace-nowrap tabular-nums")}>
              {score ?? "VS"}
            </span>
            <span className={styles.team}>
              <Image src={logoB} alt="" width={106} height={106} className={styles.teamLogo} />
              <span className={styles.teamName} title={teamB}>
                {teamB}
              </span>
            </span>
          </span>

          <ScheduleLabel label={game.label} />
          {setScoreSummary(game) && <span className="block text-xs font-normal text-black/60">{setScoreSummary(game)}</span>}
          <span className={styles.cardFooter}>
            <span className="min-w-0 truncate" title={location}>{location}</span>
            <span className={styles.time}>{time}</span>
          </span>
        </span>
      )}
      </Link>
    </Button>
  );
}

/** Homepage games are live or upcoming, so a multi-team game shows its field, not results. */
function MultiTeamGameCard({ game, now, compact }: { game: Schedules; now: Date; compact: boolean }) {
  const start = new Date(game.startDate);
  const status = getMatchdayGameStatus(game, now);
  const ongoing = status === "ONGOING";
  const location = game.location?.trim() || "TBA";
  const sport = game.gameType.gameName;
  const teams = participatingTeams(game).map(team => team.teamName).join(", ");

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(styles.card, compact ? styles.compact : styles.featured, ongoing && !compact && styles.live)}
    >
      <Link
        href={`/schedules/${game.id}`}
        aria-label={`View ${sport}: ${teams}, ${location}, ${format(start, "MMMM d, h:mm a")}${status ? `, ${status.toLowerCase()}` : ""}${game.label ? `, ${game.label}` : ""}`}
      >
      {compact ? (
        <span className={styles.cardContent}>
          <span className={styles.compactTop}>
            <span className="min-w-0 truncate font-bold uppercase" title={sport}>
              {sport}
            </span>
            <span className="min-w-0 truncate text-right text-black/60" title={location}>
              {location}
            </span>
          </span>
          <MultiTeamLogos game={game} compact />
          <ScheduleLabel label={game.label} />
        </span>
      ) : (
        <span className={styles.cardContent}>
          <span className={styles.cardTop}>
            <span className="min-w-0 truncate uppercase" title={sport}>
              {sport}
            </span>
            <span className={cn(styles.status, ongoing && styles.liveStatus)}>
              {ongoing && <span aria-hidden="true" className="size-2 rounded-full bg-white" />}
              {ongoing ? "LIVE" : "UPCOMING"}
            </span>
          </span>
          <MultiTeamLogos game={game} compact={false} />
          <ScheduleLabel label={game.label} />
          <span className={styles.cardFooter}>
            <span className="min-w-0 truncate" title={location}>{location}</span>
            <span className={styles.time}>{format(start, "h:mm a")}</span>
          </span>
        </span>
      )}
      </Link>
    </Button>
  );
}
