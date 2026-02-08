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
import { Checkbox } from "@/src/components/ui/checkbox";
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
  teamAForfeited: boolean,
  teamBForfeited: boolean,
  isDraw: boolean,
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
  const [winnerId, setWinnerId] = React.useState<number | null>(null);
  const [teamAForfeited, setTeamAForfeited] = React.useState(false);
  const [teamBForfeited, setTeamBForfeited] = React.useState(false);
  const [isDraw, setIsDraw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const editGameMutation = useEditGamesQuery();

  React.useEffect(() => {
    // When dialog opens, initialize state with current game data
    if (open && game) {
      const { a, b } = getDbScores(game);
      setAScore(a ?? 0);
      setBScore(b ?? 0);
      setWinnerId(game.winnerId ?? null);
      setTeamAForfeited(game.teamAForfeited ?? false);
      setTeamBForfeited(game.teamBForfeited ?? false);
      setIsDraw(game.isDraw ?? false);
      setError(null);
    }
  }, [open, game]);

  if (!game) return null;

  const home = game.teamA.teamName ?? `Team A${game.teamA.id}`;
  const away = game.teamB.teamName ?? `Team B${game.teamB.id}`;

  const { a: dbA, b: dbB } = getDbScores(game);
  const dbWinnerId = game.winnerId ?? null;
  const dbTeamAForfeited = game.teamAForfeited ?? false;
  const dbTeamBForfeited = game.teamBForfeited ?? false;
  const dbIsDraw = game.isDraw ?? false;
  const bothForfeited = teamAForfeited && teamBForfeited;
  const oneForfeited = teamAForfeited || teamBForfeited;

  // Editing is considered changed if scores differ from DB or winner/forfeit/draw status changed
  const editingChanged =
    (aScore !== "" && bScore !== "" && (dbA !== aScore || dbB !== bScore)) ||
    winnerId !== dbWinnerId ||
    teamAForfeited !== dbTeamAForfeited ||
    teamBForfeited !== dbTeamBForfeited ||
    isDraw !== dbIsDraw;

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

    // Validate draw condition
    if (isDraw && a !== b) {
      setError("For a draw, both teams must have equal scores.");
      return;
    }

    // Both forfeited: winnerId must be null, skip winnerId check
    // Draw: winnerId must be null
    // One or no forfeits and not draw: winnerId is required
    if (!bothForfeited && !isDraw && winnerId === null) {
      setError("Please select a winning team or mark as draw.");
      return;
    }

    try {
      const payload = toEditPayload(
        game as Schedules,
        a,
        b,
        winnerId,
        teamAForfeited,
        teamBForfeited,
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
          {/* Forfeit Checkboxes */}
          <div className="grid grid-cols-2 gap-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                id="teamAForfeit"
                checked={teamAForfeited}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setTeamAForfeited(isChecked);
                  if (isChecked) {
                    setAScore(0);
                    setBScore(0);
                    setIsDraw(false); // Clear draw if forfeit is set
                    // If B also forfeited, clear winner; otherwise B wins
                    setWinnerId(teamBForfeited ? null : game.teamB.id);
                  } else if (!teamBForfeited) {
                    // Neither forfeited now, clear winner
                    setWinnerId(null);
                  } else {
                    // Only B forfeited now, so A wins
                    setWinnerId(game.teamA.id);
                  }
                }}
                disabled={editGameMutation.isPending}
              />
              <label
                htmlFor="teamAForfeit"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {home} forfeited
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="teamBForfeit"
                checked={teamBForfeited}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setTeamBForfeited(isChecked);
                  if (isChecked) {
                    setAScore(0);
                    setBScore(0);
                    setIsDraw(false); // Clear draw if forfeit is set
                    // If A also forfeited, clear winner; otherwise A wins
                    setWinnerId(teamAForfeited ? null : game.teamA.id);
                  } else if (!teamAForfeited) {
                    // Neither forfeited now, clear winner
                    setWinnerId(null);
                  } else {
                    // Only A forfeited now, so B wins
                    setWinnerId(game.teamB.id);
                  }
                }}
                disabled={editGameMutation.isPending}
              />
              <label
                htmlFor="teamBForfeit"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {away} forfeited
              </label>
            </div>
          </div>

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
                disabled={editGameMutation.isPending || oneForfeited}
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
                disabled={editGameMutation.isPending || oneForfeited}
              />
            </div>
          </div>

          {!bothForfeited ? (
            <div className="grid grid-cols-3 items-center gap-2">
              <span className="text-muted-foreground">Winner</span>
              <div className="col-span-2">
                <Select
                  value={isDraw ? "draw" : (winnerId?.toString() ?? "")}
                  onValueChange={(value) => {
                    if (value === "draw") {
                      setIsDraw(true);
                      setWinnerId(null);
                    } else {
                      setIsDraw(false);
                      setWinnerId(Number(value));
                    }
                  }}
                  disabled={editGameMutation.isPending || oneForfeited}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select winning team or draw" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={game.teamA.id.toString()}>
                      {home}
                    </SelectItem>
                    <SelectItem value={game.teamB.id.toString()}>
                      {away}
                    </SelectItem>
                    <SelectItem value="draw">Draw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-sm text-muted-foreground">
                No winner (both teams forfeited)
              </p>
            </div>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          {editingChanged && !bothForfeited ? (
            <div className="mt-1 rounded-md border p-3 text-center">
              <div className="text-xs text-muted-foreground">
                New score (not saved)
              </div>
              <div className="text-lg font-semibold">
                {aScore} – {bScore}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {isDraw
                  ? "Result: Draw"
                  : `Winner: ${
                      winnerId === game.teamA.id
                        ? home
                        : winnerId === game.teamB.id
                          ? away
                          : "TBD"
                    }${oneForfeited ? " (forfeit)" : ""}`}
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
