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
import { SCORES_REQUIRE_TEAMS_MESSAGE } from "@/src/types/games.types";
import { useEditGamesQuery } from "@/src/queries/games.queries";

function getDbScores(g: Schedules) {
  const a = g.teamAScore != null ? Number(g.teamAScore) : null;
  const b = g.teamBScore != null ? Number(g.teamBScore) : null;
  return { a, b };
}

function toEditPayload(
  game: Schedules,
  a: number,
  b: number,
  winnerId: number | null,
  teamAForfeited: boolean,
  teamBForfeited: boolean,
  isDraw: boolean,
) {
  const gameTypeId = game.gameType.id;
  const teamAId = game.teamA?.id;
  const teamBId = game.teamB?.id;

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
    teamAForfeited,
    teamBForfeited,
    isDraw,
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
  const [error, setError] = React.useState<string | null>(null);

  const editGameMutation = useEditGamesQuery();

  React.useEffect(() => {
    // When dialog opens, initialize state with current game data
    if (open && game) {
      const { a, b } = getDbScores(game);
      setAScore(a ?? "");
      setBScore(b ?? "");
      setError(null);
    }
  }, [open, game]);

  if (!game) return null;

  const teamA = game.teamA;
  const teamB = game.teamB;

  if (!teamA || !teamB) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add / Edit Score</DialogTitle>
            <DialogDescription>
              {SCORES_REQUIRE_TEAMS_MESSAGE}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button disabled className="w-full sm:w-auto">
              Save Score
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const teamAId = teamA.id;
  const teamBId = teamB.id;
  const home = teamA.teamName ?? `Team A${teamA.id}`;
  const away = teamB.teamName ?? `Team B${teamB.id}`;

  const { a: dbA, b: dbB } = getDbScores(game);
  const editingChanged = aScore !== "" && bScore !== "" &&
    (dbA !== aScore || dbB !== bScore);

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

    const isDraw = a === b;
    const winnerId = isDraw ? null : a > b ? teamAId : teamBId;

    try {
      const payload = toEditPayload(
        game as Schedules,
        a,
        b,
        winnerId,
        false,
        false,
        isDraw,
      );
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add / Edit Score</DialogTitle>
          <DialogDescription>
            Enter the final scores then save.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-2">
            <label htmlFor="home-score" className="text-muted-foreground">{home} score</label>
            <div className="col-span-2">
              <Input
                id="home-score"
                inputMode="numeric"
                type="number"
                placeholder="Enter score"
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
            <label htmlFor="away-score" className="text-muted-foreground">{away} score</label>
            <div className="col-span-2">
              <Input
                id="away-score"
                inputMode="numeric"
                type="number"
                placeholder="Enter score"
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

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
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
