"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { AxiosError } from "axios";
import { CalendarDays, Clock, MapPin, Trophy } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useIsMutating } from "@tanstack/react-query";
import { scoreMutationKey, setScoreMutationKey, useGameQuery, useUpdateScoreQuery, useUpdateSetsQuery } from "@/src/queries/games.queries";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import { GAME_STATUS_LABELS, getGameStatus } from "@/src/lib/game-status";
import { SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";
import { MAX_SCORE_DELTA, SCORES_REQUIRE_TEAMS_MESSAGE, type ScoreDeltaPayload } from "@/src/types/games.types";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";
import { isMultiTeam, ordinal, sortedParticipants } from "@/src/lib/multi-team";
import ScheduleLabel from "./schedule-label";
import PlacingMedal from "./placing-medal";
import SetScoreboard from "./set-scoreboard";
import { isSetScoring, setTarget } from "@/src/lib/set-scoring";
import { parseApiError } from "@/src/lib/error-handler";

const AddScoreDialog = dynamic(() => import("./add-score-dialog"), { ssr: false });

const STEPS = [1, 2, 3];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE, weekday: "short", month: "short", day: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHEDULE_TIME_ZONE, hour: "numeric", minute: "2-digit",
});

function errorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { error?: unknown } | undefined)?.error;
    if (typeof message === "string") return message;
  }
  return "Something went wrong. Please try again.";
}

type Outcome = "winner" | "loser" | "draw" | "forfeit" | null;

function getOutcome(game: Schedules, team: Schedules["teamA"], forfeited: boolean): Outcome {
  if (forfeited) return "forfeit";
  if (game.isDraw) return "draw";
  if (game.winnerId == null || team == null) return null;
  return game.winnerId === team.id ? "winner" : "loser";
}

const OUTCOME_BADGES: Record<Exclude<Outcome, "loser" | null>, { label: string; className: string }> = {
  winner: { label: "Winner", className: "bg-tc_primary-400 text-white" },
  draw: { label: "Draw", className: "bg-neutral-800 text-white" },
  forfeit: { label: "Forfeit", className: "bg-neutral-300 text-neutral-700" },
};

type TeamScoreProps = {
  team: Schedules["teamA"];
  score: string;
  outcome: Outcome;
  /** Numeric score for the minus-button floor; omitted for viewers who cannot edit. */
  editable?: { value: number; onChange: (delta: number) => void; disabled?: boolean };
};

function TeamScore({ team, score, outcome, editable }: TeamScoreProps) {
  const [custom, setCustom] = useState("");
  const customDelta = Number(custom);
  const customValid = custom !== "" && Number.isInteger(customDelta) && customDelta > 0 && customDelta <= MAX_SCORE_DELTA;
  const name = team?.teamName ?? "TBD";
  const badge = outcome && outcome !== "loser" ? OUTCOME_BADGES[outcome] : null;
  const dimmed = outcome === "loser" || outcome === "forfeit";

  return (
    <section
      aria-label={`${name} score${badge ? `, ${badge.label.toLowerCase()}` : ""}`}
      className={cn(
        "flex flex-col items-center gap-4 border-t-4 bg-neutral-100 p-4 sm:p-6",
        outcome === "winner" ? "border-tc_primary-400 bg-white shadow-sm" : "border-transparent",
      )}
    >
      {/* Reserved on both cards so logos and scores stay aligned whether or not a badge shows. */}
      <div className="flex h-6 items-center">
        {badge && (
          <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-bold tracking-wider uppercase", badge.className)}>
            {outcome === "winner" && <Trophy aria-hidden="true" className="size-3.5" />}
            {badge.label}
          </span>
        )}
      </div>
      <div className={cn("flex flex-col items-center gap-2", dimmed && "opacity-50")}>
        {team ? (
          <Image src={getLogoForSchool(name)} alt="" width={64} height={64} className="size-16 object-contain" />
        ) : (
          <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full border border-neutral-300 text-2xl text-neutral-500">?</span>
        )}
        <h2 className="text-center text-lg font-bold uppercase sm:text-xl">{name}</h2>
      </div>
      <output
        aria-live="polite"
        className={cn(
          "text-6xl font-bold tabular-nums sm:text-7xl",
          outcome === "winner" && "text-tc_primary-500",
          dimmed && "text-neutral-400",
        )}
      >
        {score}
      </output>
      {editable && (
        <>
          <div className="grid w-full grid-cols-3 gap-2">
            {STEPS.map(step => (
              <Button key={`+${step}`} size="lg" disabled={editable.disabled} onClick={() => editable.onChange(step)} aria-label={`Add ${step} to ${name}`}>
                +{step}
              </Button>
            ))}
            {STEPS.map(step => (
              <Button
                key={`-${step}`}
                size="lg"
                variant="outline"
                disabled={editable.disabled || editable.value - step < 0}
                onClick={() => editable.onChange(-step)}
                aria-label={`Subtract ${step} from ${name}`}
              >
                −{step}
              </Button>
            ))}
          </div>
          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
            <Input
              aria-label={`Custom amount for ${name}`}
              inputMode="numeric"
              type="number"
              min={1}
              max={MAX_SCORE_DELTA}
              step={1}
              placeholder="Amount"
              value={custom}
              disabled={editable.disabled}
              onChange={(e) => setCustom(e.currentTarget.value)}
            />
            <Button
              variant="outline"
              disabled={editable.disabled || !customValid}
              onClick={() => { editable.onChange(customDelta); setCustom(""); }}
            >
              Add
            </Button>
            <Button
              variant="outline"
              disabled={editable.disabled || !customValid || editable.value - customDelta < 0}
              onClick={() => { editable.onChange(-customDelta); setCustom(""); }}
            >
              Subtract
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

function GameScore({ game, canManage }: { game: Schedules; canManage: boolean }) {
  const updateScore = useUpdateScoreQuery(game.id);
  const updateSets = useUpdateSetsQuery(game.id);
  // Finalizing waits for pending score changes so the dialog starts from the saved score.
  const savingScore = useIsMutating({ mutationKey: scoreMutationKey(game.id) }) > 0;
  const savingSets = useIsMutating({ mutationKey: setScoreMutationKey(game.id) }) > 0;
  const [finalizeOpen, setFinalizeOpen] = useState(false);

  const status = getGameStatus(game, new Date());
  const finished = status === "finished";
  const teamsSet = game.teamA != null && game.teamB != null;
  const setBased = isSetScoring(game);
  const activeSet = game.sets?.find(set => set.status === "IN_PROGRESS");
  const showSetPoints = setBased && !finished && activeSet != null;
  const canTrack = canManage && teamsSet && !finished && (!setBased || activeSet != null);
  const scoreA = showSetPoints ? activeSet.teamAPoints : game.teamAScore;
  const scoreB = showSetPoints ? activeSet.teamBPoints : game.teamBScore;

  function display(score: Schedules["teamAScore"] | number, forfeited: boolean) {
    if (forfeited) return "X";
    return score == null ? "–" : String(Number(score));
  }

  function editable(team: ScoreDeltaPayload["team"], score: Schedules["teamAScore"] | number) {
    if (!canTrack) return undefined;
    if (setBased) {
      if (!activeSet) return undefined;
      const setId = activeSet.id;
      return {
        value: Number(score ?? 0),
        disabled: savingSets,
        onChange: (delta: number) => updateSets.mutate({
          action: "point", scoringVersion: game.scoringVersion ?? 0, setId, team, delta,
        }),
      };
    }
    return {
      value: Number(score ?? 0),
      onChange: (delta: number) => updateScore.mutate({ team, delta }),
    };
  }

  return (
    <>
      <header className="space-y-2">
        <p className="text-sm text-neutral-600">{game.gameType.gameName}</p>
        <ScheduleLabel label={game.label} />
        <h1 className="text-2xl font-bold sm:text-3xl">
          {game.teamA?.teamName ?? "TBD"} vs {game.teamB?.teamName ?? "TBD"}
        </h1>
        <p className="inline-block bg-tc_primary-400 px-2 py-1 text-xs text-white uppercase">{GAME_STATUS_LABELS[status]}</p>
      </header>

      {setBased && <div className="space-y-1">
        <p className="text-sm font-bold uppercase">{showSetPoints
          ? `Set ${activeSet.setNumber} · Points · to ${setTarget(game.bestOf ?? 3, activeSet.setNumber)}, win by two`
          : "Match score · Sets won"}</p>
        {showSetPoints && <p className="text-sm text-neutral-600">
          Sets won: {game.teamA?.teamName} {String(game.teamAScore ?? 0)}–{String(game.teamBScore ?? 0)} {game.teamB?.teamName}
        </p>}
      </div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <TeamScore
          key={`A-${showSetPoints ? activeSet.id : "match"}`}
          team={game.teamA}
          score={display(scoreA, game.teamAForfeited)}
          outcome={getOutcome(game, game.teamA, game.teamAForfeited)}
          editable={editable("A", scoreA)}
        />
        <TeamScore
          key={`B-${showSetPoints ? activeSet.id : "match"}`}
          team={game.teamB}
          score={display(scoreB, game.teamBForfeited)}
          outcome={getOutcome(game, game.teamB, game.teamBForfeited)}
          editable={editable("B", scoreB)}
        />
      </div>
      {setBased && <SetScoreboard game={game} canManage={canManage} />}

      {canManage && !teamsSet && <p className="text-sm text-neutral-600">{SCORES_REQUIRE_TEAMS_MESSAGE}</p>}
      {updateScore.isError && (
        <p role="alert" className="text-sm text-red-600">{errorMessage(updateScore.error)}</p>
      )}
      {updateSets.isError && <p role="alert" className="text-sm text-red-600">{parseApiError(updateSets.error)}</p>}
      {(canTrack || (setBased && canManage && teamsSet)) && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setFinalizeOpen(true)} disabled={savingScore || savingSets}>{setBased ? "Edit result" : "Finalize"}</Button>
          </div>
          <AddScoreDialog open={finalizeOpen} onOpenChange={setFinalizeOpen} game={game} />
        </>
      )}

      <MatchDetails game={game} />
    </>
  );
}

/** Every team in a multi-team game, in finishing order once ranked. */
function MultiTeamGame({ game, canManage }: { game: Schedules; canManage: boolean }) {
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const status = getGameStatus(game, new Date());
  const finished = status === "finished";
  const canFinalize = canManage && !finished && game.participants.length > 0;

  return (
    <>
      <header className="space-y-2">
        <ScheduleLabel label={game.label} />
        <h1 className="text-2xl font-bold sm:text-3xl">{game.gameType.gameName}</h1>
        <p className="inline-block bg-tc_primary-400 px-2 py-1 text-xs text-white uppercase">{GAME_STATUS_LABELS[status]}</p>
      </header>

      <section aria-labelledby="placings-heading" className="bg-neutral-100">
        <h2 id="placings-heading" className="bg-tc_primary-400 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase sm:px-6">
          {finished ? "Results" : "Teams"}
        </h2>
        {game.participants.length === 0 ? (
          <p className="p-4 text-sm text-neutral-600 sm:p-6">No teams have been added yet.</p>
        ) : (
          <ol className="divide-y divide-neutral-200">
            {sortedParticipants(game).map(({ id, name, team, rank }) => (
              <li
                key={id}
                className={cn(
                  "grid grid-cols-[3rem_1.5rem_2.5rem_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:px-6",
                  rank === 1 && "bg-white",
                )}
              >
                <span className={cn("text-sm font-bold tabular-nums", rank == null && "text-neutral-400")}>
                  {rank != null ? ordinal(rank) : finished ? "DNF" : "–"}
                </span>
                <PlacingMedal rank={rank} />
                <Image src={getLogoForSchool(team.teamName)} alt="" width={40} height={40} className="size-10 object-contain" />
                <span className={cn("flex min-w-0 flex-col", finished && rank == null && "opacity-50")}>
                  <span className="truncate font-bold uppercase">{name ?? team.teamName}</span>
                  {name != null && <span className="truncate text-sm text-neutral-600">{team.teamName}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {canFinalize && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setFinalizeOpen(true)}>Finalize</Button>
          </div>
          <AddScoreDialog open={finalizeOpen} onOpenChange={setFinalizeOpen} game={game} />
        </>
      )}

      <MatchDetails game={game} />
    </>
  );
}

function MatchDetails({ game }: { game: Schedules }) {
  const location = game.location?.trim() || "Location TBA";
  const start = new Date(game.startDate);
  // Sport, teams, status, and the result badges already appear above the details.
  const details = [
    { label: "Date", value: dateFormatter.format(start), Icon: CalendarDays },
    { label: "Time", value: `${timeFormatter.format(start)} – ${timeFormatter.format(new Date(game.endDate))}`, Icon: Clock },
    { label: "Venue", value: location, Icon: MapPin },
  ];

  return (
    <section aria-labelledby="match-details-heading" className="bg-neutral-100">
      <h2 id="match-details-heading" className="bg-tc_primary-400 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase sm:px-6">
        Match details
      </h2>
      <dl className="grid divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {details.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-center gap-3 p-4 sm:flex-col sm:items-start sm:p-6">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center bg-tc_primary-400/10 text-tc_primary-500">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium tracking-wider text-neutral-500 uppercase">{label}</dt>
              <dd className="mt-0.5 font-semibold break-words">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function GamePage({ gameId }: { gameId: number }) {
  const { hasAccess } = useHasHeraldDomainAccess();
  const game = useGameQuery(gameId);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f6f6] text-[#171717]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
        <Link href="/schedules" className="text-sm text-tc_primary-500 underline-offset-4 hover:underline">
          ← Back to schedules
        </Link>
        {game.isPending ? (
          <p className="text-neutral-600">Loading…</p>
        ) : game.isError ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-neutral-600">{errorMessage(game.error)}</p>
            <Button variant="outline" onClick={() => void game.refetch()}>Try again</Button>
          </div>
        ) : (
          isMultiTeam(game.data)
            ? <MultiTeamGame game={game.data} canManage={hasAccess} />
            : <GameScore game={game.data} canManage={hasAccess} />
        )}
      </div>
    </div>
  );
}
