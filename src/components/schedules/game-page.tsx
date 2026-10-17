"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { AxiosError } from "axios";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useIsMutating } from "@tanstack/react-query";
import { scoreMutationKey, useGameQuery, useUpdateScoreQuery } from "@/src/queries/games.queries";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import { GAME_STATUS_LABELS, getGameStatus } from "@/src/lib/game-status";
import { SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";
import { MAX_SCORE_DELTA, SCORES_REQUIRE_TEAMS_MESSAGE, type ScoreDeltaPayload } from "@/src/types/games.types";
import { getLogoForSchool } from "@/src/lib/utils";
import type { Schedules } from "@/src/types/types";

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

function resultLabel(game: Schedules) {
  if (game.teamAForfeited && game.teamBForfeited) return "Both teams forfeited";
  if (game.isDraw) return "Draw";
  if (game.winner) {
    const forfeit = game.teamAForfeited || game.teamBForfeited ? " (forfeit)" : "";
    return `${game.winner.teamName} wins${forfeit}`;
  }
  return null;
}

type TeamScoreProps = {
  team: Schedules["teamA"];
  score: string;
  /** Numeric score for the minus-button floor; omitted for viewers who cannot edit. */
  editable?: { value: number; onChange: (delta: number) => void };
};

function TeamScore({ team, score, editable }: TeamScoreProps) {
  const [custom, setCustom] = useState("");
  const customDelta = Number(custom);
  const customValid = custom !== "" && Number.isInteger(customDelta) && customDelta > 0 && customDelta <= MAX_SCORE_DELTA;
  const name = team?.teamName ?? "TBD";

  return (
    <section aria-label={`${name} score`} className="flex flex-col items-center gap-4 bg-neutral-100 p-4 sm:p-6">
      <div className="flex flex-col items-center gap-2">
        {team ? (
          <Image src={getLogoForSchool(name)} alt="" width={64} height={64} className="size-16 object-contain" />
        ) : (
          <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full border border-neutral-300 text-2xl text-neutral-500">?</span>
        )}
        <h2 className="text-center text-lg font-bold uppercase sm:text-xl">{name}</h2>
      </div>
      <output aria-live="polite" className="text-6xl font-bold tabular-nums sm:text-7xl">{score}</output>
      {editable && (
        <>
          <div className="grid w-full grid-cols-3 gap-2">
            {STEPS.map(step => (
              <Button key={`+${step}`} size="lg" onClick={() => editable.onChange(step)} aria-label={`Add ${step} to ${name}`}>
                +{step}
              </Button>
            ))}
            {STEPS.map(step => (
              <Button
                key={`-${step}`}
                size="lg"
                variant="outline"
                disabled={editable.value - step < 0}
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
              onChange={(e) => setCustom(e.currentTarget.value)}
            />
            <Button
              variant="outline"
              disabled={!customValid}
              onClick={() => { editable.onChange(customDelta); setCustom(""); }}
            >
              Add
            </Button>
            <Button
              variant="outline"
              disabled={!customValid || editable.value - customDelta < 0}
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
  // Finalizing waits for pending score changes so the dialog starts from the saved score.
  const savingScore = useIsMutating({ mutationKey: scoreMutationKey(game.id) }) > 0;
  const [finalizeOpen, setFinalizeOpen] = useState(false);

  const status = getGameStatus(game, new Date());
  const finished = status === "finished";
  const teamsSet = game.teamA != null && game.teamB != null;
  const canTrack = canManage && teamsSet && !finished;
  const result = resultLabel(game);
  const location = game.location?.trim() || "Location TBA";
  const start = new Date(game.startDate);
  // Sport, teams, status, and result already appear above the details.
  const details = [
    { label: "Date", value: dateFormatter.format(start), Icon: CalendarDays },
    { label: "Time", value: `${timeFormatter.format(start)} – ${timeFormatter.format(new Date(game.endDate))}`, Icon: Clock },
    { label: "Venue", value: location, Icon: MapPin },
  ];

  function display(score: Schedules["teamAScore"], forfeited: boolean) {
    if (forfeited) return "X";
    return score == null ? "–" : String(Number(score));
  }

  function editable(team: ScoreDeltaPayload["team"], score: Schedules["teamAScore"]) {
    if (!canTrack) return undefined;
    return {
      value: Number(score ?? 0),
      onChange: (delta: number) => updateScore.mutate({ team, delta }),
    };
  }

  return (
    <>
      <header className="space-y-2">
        <p className="text-sm text-neutral-600">{game.gameType.gameName}</p>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {game.teamA?.teamName ?? "TBD"} vs {game.teamB?.teamName ?? "TBD"}
        </h1>
        <p className="inline-block bg-tc_primary-400 px-2 py-1 text-xs text-white uppercase">{GAME_STATUS_LABELS[status]}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <TeamScore
          team={game.teamA}
          score={display(game.teamAScore, game.teamAForfeited)}
          editable={editable("A", game.teamAScore)}
        />
        <TeamScore
          team={game.teamB}
          score={display(game.teamBScore, game.teamBForfeited)}
          editable={editable("B", game.teamBScore)}
        />
      </div>

      {result && <p className="text-center text-lg font-semibold">{result}</p>}

      {canManage && !teamsSet && <p className="text-sm text-neutral-600">{SCORES_REQUIRE_TEAMS_MESSAGE}</p>}
      {updateScore.isError && (
        <p role="alert" className="text-sm text-red-600">{errorMessage(updateScore.error)}</p>
      )}
      {canTrack && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setFinalizeOpen(true)} disabled={savingScore}>Finalize</Button>
          </div>
          <AddScoreDialog open={finalizeOpen} onOpenChange={setFinalizeOpen} game={game} />
        </>
      )}

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
    </>
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
          <GameScore game={game.data} canManage={hasAccess} />
        )}
      </div>
    </div>
  );
}
