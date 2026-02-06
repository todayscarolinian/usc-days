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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import type { Schedules } from "@/src/types/types";
import { useEditGamesQuery } from "@/src/queries/games.queries";

function getDbScores(g: Schedules) {
  const a = Number(g.teamAScore) ?? null;
  const b = Number(g.teamBScore) ?? null;
  return { a, b };
}

function toEditPayload(
  game: Schedules,
  a: number,
  b: number,
  winnerId: number | null,
) {
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
};

export default function AddScoreDialog({ open, onOpenChange, game }: Props) {
  const [aScore, setAScore] = React.useState<number | "">("");
  const [bScore, setBScore] = React.useState<number | "">("");
  const [winnerId, setWinnerId] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const editGameMutation = useEditGamesQuery();

  React.useEffect(() => {
    if (open && game) {
      const { a, b } = getDbScores(game);
      console.log("Initializing scores:", a, b);
      setAScore(a ?? 0);
      setBScore(b ?? 0);
      setWinnerId(game.winnerId ?? null);
      setError(null);
    }
  }, [open, game]);

  if (!game) return null;

  const home = game.teamA.teamName ?? `Team A${game.teamA.id}`;
  const away = game.teamB.teamName ?? `Team B${game.teamB.id}`;

  const { a: dbA, b: dbB } = getDbScores(game);
  const dbWinnerId = game.winnerId ?? null;
  const editingChanged =
    (aScore && bScore && (dbA !== aScore || dbB !== bScore)) ||
    winnerId !== dbWinnerId;

  async function save() {
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
      return;
    }

    if (winnerId === null) {
      setError("Please select a winning team.");
      return;
    }

    try {
      const payload = toEditPayload(game as Schedules, a, b, winnerId);
      await editGameMutation.mutateAsync(payload);
      onOpenChange(false);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Something went wrong while saving.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
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
                disabled={editGameMutation.isPending}
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
                disabled={editGameMutation.isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <span className="text-muted-foreground">Winner</span>
            <div className="col-span-2">
              <Select
                value={winnerId?.toString()}
                onValueChange={(value) => {
                  setWinnerId(Number(value));
                }}
                disabled={editGameMutation.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select winning team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={game.teamA.id.toString()}>
                    {home}
                  </SelectItem>
                  <SelectItem value={game.teamB.id.toString()}>
                    {away}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          {editingChanged ? (
            <div className="mt-1 rounded-md border p-3 text-center">
              <div className="text-xs text-muted-foreground">
                New score (not saved)
              </div>
              <div className="text-lg font-semibold">
                {aScore} – {bScore}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Winner: {winnerId === game.teamA.id ? home : away}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={editGameMutation.isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={editGameMutation.isPending || !editingChanged}
            className="w-full sm:w-auto"
          >
            {editGameMutation.isPending ? "Saving…" : "Save Score"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
