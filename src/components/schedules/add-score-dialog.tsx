"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { Schedules } from "@/src/types/types";

function getDbScores(g: Schedules) {
  const a = g.teamAScore ?? null;
  const b = g.teamBScore ?? null;
  return { a, b };
}

function toEditPayload(game: Schedules, a: number, b: number) {
  const gameTypeId = game.gameType.id;
  const teamAId = game.teamA.id;
  const teamBId = game.teamB.id;

  if (
    typeof gameTypeId !== "number" ||
    typeof teamAId !== "number" ||
    typeof teamBId !== "number"
  ) {
    throw new Error("Missing required IDs (gameTypeId, teamAId, teamBId).");
  }

  const winnerId = a === b ? null : a > b ? teamAId : teamBId;

  const startDate =
    typeof game.startDate === "string"
      ? game.startDate
      : new Date(game.startDate).toISOString();
  const endDate =
    typeof game.endDate === "string"
      ? game.endDate
      : new Date(game.endDate).toISOString();

  return {
    id: Number(game.id),
    gameTypeId,
    teamAId,
    teamBId,
    startDate,
    endDate,
    location: game.location ?? undefined,
    teamAScore: a,
    teamBScore: b,
    winnerId,
  };
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: Schedules | null;
  onSaved?: (updated: Schedules) => void;
};

export default function AddScoreDialog({
  open,
  onOpenChange,
  game,
  onSaved,
}: Props) {
  const [aScore, setAScore] = React.useState<number | "">("");
  const [bScore, setBScore] = React.useState<number | "">("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && game) {
      const { a, b } = getDbScores(game);
      console.log("Initializing scores:", a, b);
      setAScore(a ?? 0);
      setBScore(b ?? 0);
      setError(null);
    }
  }, [open, game]);

  if (!game) return null;

  const home = game.teamA.teamName ?? `Team A${game.teamA.id}`;
  const away = game.teamB.teamName ?? `Team B${game.teamB.id}`;

  const { a: dbA, b: dbB } = getDbScores(game);
  const editingChanged = aScore && bScore && (dbA !== aScore || dbB !== bScore);

  async function save() {
    try {
      setBusy(true);
      setError(null);

      const a = aScore === "" ? null : Number(aScore);
      const b = bScore === "" ? null : Number(bScore);

      if (
        a === null ||
        b === null ||
        a < 0 ||
        b < 0 ||
        !Number.isFinite(a) ||
        !Number.isFinite(b)
      ) {
        setError("Please enter valid non-negative numbers for both scores.");
        setBusy(false);
        return;
      }

      const payload = toEditPayload(game as Schedules, a, b);

      const res = await fetch(`/api/games`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save score");
      }

      const { updatedGame } = await res.json();
      onSaved?.(updatedGame);
      onOpenChange(false);
      window.location.reload();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Something went wrong while saving."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add / Edit Score</DialogTitle>
          <DialogDescription>
            Enter the final scores then save.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-2">
            <span className="text-muted-foreground">{home} score</span>
            <div className="col-span-2">
              <Input
                inputMode="numeric"
                type="number"
                min={0}
                step={1}
                value={aScore}
                onChange={(e) => {
                  const v = e.currentTarget.value;
                  setAScore(v === "" ? "" : Number(v));
                }}
                disabled={busy}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <span className="text-muted-foreground">{away} score</span>
            <div className="col-span-2">
              <Input
                inputMode="numeric"
                type="number"
                min={0}
                step={1}
                value={bScore}
                onChange={(e) => {
                  const v = e.currentTarget.value;
                  setBScore(v === "" ? "" : Number(v));
                }}
                disabled={busy}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          {editingChanged && (
            <div className="mt-1 rounded-md border p-3 text-center">
              <div className="text-xs text-muted-foreground">
                New score (not saved)
              </div>
              <div className="text-lg font-semibold">
                {aScore} – {bScore}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={busy || !editingChanged}
            className="w-full sm:w-auto"
          >
            {busy ? "Saving…" : "Save Score"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
