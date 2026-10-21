"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useUpdateSetsQuery } from "@/src/queries/games.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { summarizeSets, summarizeFinalSets, setTarget, type SetScore } from "@/src/lib/set-scoring";
import { SCORES_REQUIRE_TEAMS_MESSAGE } from "@/src/types/games.types";
import type { Schedules } from "@/src/types/types";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; game: Schedules };
type Row = { a: string; b: string; completed: boolean };

export default function AddSetScoresDialog(props: Props) {
  return props.open ? <SetScoresEditor {...props} /> : null;
}

function SetScoresEditor({ game, open, onOpenChange }: Props) {
  // Snapshot once when opened: polling cannot overwrite edits or silently advance their version.
  const [version] = useState(game.scoringVersion ?? 0);
  const [rows, setRows] = useState<Row[]>((game.sets ?? []).map(s => ({
    a: String(s.teamAPoints), b: String(s.teamBPoints), completed: s.status === "COMPLETED",
  })));
  const [aForfeit, setAForfeit] = useState(game.teamAForfeited);
  const [bForfeit, setBForfeit] = useState(game.teamBForfeited);
  const [finalOnly, setFinalOnly] = useState((game.sets?.length ?? 0) === 0);
  const [finalA, setFinalA] = useState(game.teamAScore == null ? "" : String(Number(game.teamAScore)));
  const [finalB, setFinalB] = useState(game.teamBScore == null ? "" : String(Number(game.teamBScore)));
  const update = useUpdateSetsQuery(game.id);
  const bestOf = game.bestOf ?? 3;
  const teamsSet = game.teamA != null && game.teamB != null;
  let sets: SetScore[] = [];
  let summary: ReturnType<typeof summarizeSets> | undefined;
  let error: string | undefined;
  try {
    if (finalOnly) {
      if (finalA.trim() === "" || finalB.trim() === "") throw new Error("Enter the final sets won for both teams.");
      summary = summarizeFinalSets(bestOf, Number(finalA), Number(finalB), aForfeit || bForfeit);
    } else {
      sets = rows.map((row, i) => {
        if (row.a.trim() === "" || row.b.trim() === "") throw new Error(`Enter both scores for set ${i + 1}.`);
        return { setNumber: i + 1, teamAPoints: Number(row.a), teamBPoints: Number(row.b), status: row.completed ? "COMPLETED" : "IN_PROGRESS" };
      });
      summary = summarizeSets(bestOf, sets);
    }
  } catch (e) { error = e instanceof Error ? e.message : "Invalid set scores."; }
  const winner = aForfeit || bForfeit
    ? aForfeit && bForfeit ? null : aForfeit ? game.teamB?.teamName : game.teamA?.teamName
    : summary?.winner === "A" ? game.teamA?.teamName : summary?.winner === "B" ? game.teamB?.teamName : null;
  function change(index: number, patch: Partial<Row>) {
    setRows(current => current.map((r, i) => i === index ? { ...r, ...patch } : r));
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit volleyball result</DialogTitle>
          <DialogDescription>Best of {bestOf}. Enter final sets won, or optionally record points per set. Winner is calculated automatically.</DialogDescription>
        </DialogHeader>
        {!teamsSet ? <p>{SCORES_REQUIRE_TEAMS_MESSAGE}</p> : <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Result entry method">
            <Button variant={finalOnly ? "default" : "outline"} aria-pressed={finalOnly} disabled={update.isPending} onClick={() => setFinalOnly(true)}>Final score only</Button>
            <Button variant={!finalOnly ? "default" : "outline"} aria-pressed={!finalOnly} disabled={update.isPending} onClick={() => setFinalOnly(false)}>Per-set points (optional)</Button>
          </div>
          {finalOnly ? <div className="space-y-3">
            <p className="text-sm text-muted-foreground">First to {bestOf === 5 ? 3 : 2} sets wins. No individual set points required.</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">{game.teamA?.teamName} sets won
                <Input type="number" inputMode="numeric" min={0} max={bestOf === 5 ? 3 : 2} step={1} value={finalA} disabled={update.isPending} onChange={e => setFinalA(e.target.value)} />
              </label>
              <label className="text-sm">{game.teamB?.teamName} sets won
                <Input type="number" inputMode="numeric" min={0} max={bestOf === 5 ? 3 : 2} step={1} value={finalB} disabled={update.isPending} onChange={e => setFinalB(e.target.value)} />
              </label>
            </div>
            {(game.sets?.length ?? 0) > 0 && <p className="text-sm text-muted-foreground">Saving final score only replaces the existing set breakdown with these totals.</p>}
          </div> : <><div className="space-y-3">
            <p className="text-sm text-muted-foreground">All sets require a two-point lead. Totals are calculated from completed sets.</p>
            {rows.map((row, i) => <fieldset key={i} className="space-y-2 border p-3" disabled={update.isPending}>
              <legend className="px-1 text-sm font-bold">Set {i + 1} · to {setTarget(bestOf, i + 1)}</legend>
              <div className="grid grid-cols-2 gap-3">
                {(["a", "b"] as const).map(side => <label key={side} className="min-w-0 text-sm">
                  {side === "a" ? game.teamA?.teamName : game.teamB?.teamName}
                  <Input type="number" inputMode="numeric" min={0} step={1} value={row[side]} onChange={e => change(i, { [side]: e.target.value })} />
                </label>)}
              </div>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={row.completed} onCheckedChange={v => change(i, { completed: v === true })} />Set completed</label>
            </fieldset>)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={update.isPending || rows.length >= bestOf || rows.some(r => !r.completed) || !!summary?.winner}
              onClick={() => setRows(r => [...r, { a: "", b: "", completed: true }])}>Add set</Button>
            {rows.length > 0 && <Button variant="ghost" disabled={update.isPending} onClick={() => setRows(r => r.slice(0, -1))}>Remove last set</Button>}
          </div>
          </>}
          <Button variant="ghost" disabled={update.isPending} onClick={() => { setRows([]); setFinalOnly(false); setFinalA(""); setFinalB(""); setAForfeit(false); setBForfeit(false); }}>Clear result</Button>
          <div className="space-y-2 border-t pt-3">
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={aForfeit} disabled={update.isPending} onCheckedChange={v => setAForfeit(v === true)} />{game.teamA?.teamName} forfeited</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={bForfeit} disabled={update.isPending} onCheckedChange={v => setBForfeit(v === true)} />{game.teamB?.teamName} forfeited</label>
          </div>
          {summary && <div className="bg-muted p-3 text-center">
            <p className="font-bold">Sets won: {summary.a}–{summary.b}</p>
            <p className="text-sm">{winner ? `${winner} wins${aForfeit || bForfeit ? " by forfeit" : ""}` : aForfeit && bForfeit ? "Both teams forfeited" : rows.length ? "No winner yet" : "Result cleared"}</p>
          </div>}
        </>}
        {(error || update.isError) && <p role="alert" className="text-sm text-red-600">{error ?? parseApiError(update.error)}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!teamsSet || !!error || update.isPending} onClick={() => update.mutate(finalOnly ? {
            action: "final", scoringVersion: version, teamAScore: Number(finalA), teamBScore: Number(finalB), teamAForfeited: aForfeit, teamBForfeited: bForfeit,
          } : {
            action: "replace", scoringVersion: version, sets, teamAForfeited: aForfeit, teamBForfeited: bForfeit,
          }, { onSuccess: () => onOpenChange(false) })}>{update.isPending ? "Saving…" : finalOnly ? "Save final score" : "Save set scores"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
