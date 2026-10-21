"use client";

import { Button } from "@/src/components/ui/button";
import { setScoreMutationKey, useUpdateSetsQuery } from "@/src/queries/games.queries";
import { useIsMutating } from "@tanstack/react-query";
import { setTarget, validCompletedSet } from "@/src/lib/set-scoring";
import { parseApiError } from "@/src/lib/error-handler";
import type { Schedules } from "@/src/types/types";

export default function SetScoreboard({ game, canManage }: { game: Schedules; canManage: boolean }) {
  const update = useUpdateSetsQuery(game.id);
  const saving = useIsMutating({ mutationKey: setScoreMutationKey(game.id) }) > 0;
  const sets = game.sets ?? [];
  const active = sets.find(s => s.status === "IN_PROGRESS");
  const finished = game.winnerId != null || game.teamAForfeited || game.teamBForfeited;
  const teamsSet = game.teamA != null && game.teamB != null;
  const bestOf = game.bestOf ?? 3;
  const target = setTarget(bestOf, active?.setNumber ?? sets.length + 1);
  const legacy = sets.length === 0 && (game.teamAScore != null || game.teamBScore != null);
  const version = game.scoringVersion ?? 0;
  return (
    <section className="space-y-4 bg-neutral-100 p-4 sm:p-6" aria-label="Set scores">
      <div>
        <h2 className="font-bold">Sets won · Best of {bestOf}</h2>
        <p className="text-sm text-neutral-600">{bestOf === 5 ? "First to 3 sets. Sets 1–4 to 25; set 5 to 15." : "First to 2 sets. All sets to 25."} Win by two, no cap.</p>
      </div>
      {sets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <caption className="sr-only">Points per set, with match totals in sets won</caption>
            <thead><tr className="border-b text-neutral-600">
              <th scope="col" className="p-2 text-left">Team</th>
              {Array.from({ length: bestOf }, (_, i) => <th scope="col" className="p-2" key={i}>S{i + 1}{active?.setNumber === i + 1 ? " •" : ""}</th>)}
              <th scope="col" className="p-2">Sets</th>
            </tr></thead>
            <tbody>{(["A", "B"] as const).map(side => (
              <tr key={side}>
                <th scope="row" className="p-2 text-left">{side === "A" ? game.teamA?.teamName ?? "TBD" : game.teamB?.teamName ?? "TBD"}</th>
                {Array.from({ length: bestOf }, (_, i) => {
                  const set = sets.find(s => s.setNumber === i + 1);
                  return <td key={i} className={`p-2 text-center ${set?.status === "IN_PROGRESS" ? "bg-white font-bold" : ""}`}>{set ? side === "A" ? set.teamAPoints : set.teamBPoints : "—"}</td>;
                })}
                <td className="p-2 text-center font-bold">{String((side === "A" ? game.teamAScore : game.teamBScore) ?? "—")}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p className="text-sm text-neutral-600">{legacy ? "Per-set points not recorded. The match score shows sets won." : "No sets started. Per-set points are optional; you can enter the final result directly."}</p>}
      {!finished && active && (
        <div className="space-y-3">
          <h3 className="text-center font-bold">Set {active.setNumber} — in progress · to {target}, win by two</h3>
          {canManage && teamsSet && <Button className="w-full" disabled={saving || !validCompletedSet(active.teamAPoints, active.teamBPoints, target)}
            onClick={() => update.mutate({ action: "complete", scoringVersion: version, setId: active.id })}>
            {saving ? "Saving…" : "Complete set"}
          </Button>}
        </div>
      )}
      {!finished && !active && !legacy && <div className="space-y-2">
        {sets.length > 0 && <p className="text-sm text-neutral-600">Between sets</p>}
        {canManage && teamsSet && <Button disabled={saving} onClick={() => update.mutate({ action: "start", scoringVersion: version })}>
          {saving ? "Starting…" : `Start set ${sets.length + 1}`}
        </Button>}
      </div>}
      {update.isError && <p role="alert" className="text-sm text-red-600">{parseApiError(update.error)}</p>}
    </section>
  );
}
