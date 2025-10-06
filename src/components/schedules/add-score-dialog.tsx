"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Schedules } from "@/types/types";
import { useState } from "react";
type GameLike = Schedules & {
  id: number | string;
  startDate: string | Date;
  endDate: string | Date;
  teamAScore?: number | null;
  teamBScore?: number | null;
  gameTypeId?: number;
  teamAId?: number;
  teamBId?: number;
  gameType?: { id?: number; name?: string; gameName?: string } | null;
  teamA?: { id?: number; name?: string; teamName?: string } | null;
  teamB?: { id?: number; name?: string; teamName?: string } | null;
  teamAName?: string;
  teamBName?: string;
  location?: string | null;
};

type GameWithScore = GameLike & {
    score?: { teamAScore?: number | null; teamBScore?: number | null } | null;
};

type WithOptionalRefs = GameWithScore & {
  gameType?: { id?: number };
  teamA?: { id?: number };
  teamB?: { id?: number };
};

function getDbScores(g: GameWithScore) {
  const a = g.teamAScore ?? g.score?.teamAScore ?? null;
  const b = g.teamBScore ?? g.score?.teamBScore ?? null;
  return { a, b };
}

function toEditPayload(game: WithOptionalRefs, a: number, b: number) {
  const gameTypeId = game.gameTypeId ?? game.gameType?.id;
  const teamAId = game.teamAId ?? game.teamA?.id;
  const teamBId = game.teamBId ?? game.teamB?.id;

  if (typeof gameTypeId !== "number" || typeof teamAId !== "number" || typeof teamBId !== "number") {
    throw new Error("Missing required IDs (gameTypeId, teamAId, teamBId).");
  }

  const winnerId = a === b ? null : a > b ? teamAId : teamBId;

  const startDate = typeof game.startDate === "string" ? game.startDate : new Date(game.startDate).toISOString();
  const endDate = typeof game.endDate === "string" ? game.endDate : new Date(game.endDate).toISOString();

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
  game: GameWithScore | null;
  onSaved?: (updated: any) => void; // keep as any if your parent already expects any
};

export default function AddScoreDialog({ open, onOpenChange, game, onSaved }: Props) {
  const [aScore, setAScore] = React.useState<number | "">("");
  const [bScore, setBScore] = React.useState<number | "">("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showAddScore, setShowAddScore] = useState(false);

  React.useEffect(() => {
    if (open && game) {
      const { a, b } = getDbScores(game);
      setAScore(typeof a === "number" ? a : 0);
      setBScore(typeof b === "number" ? b : 0);
      setError(null);
    }
  }, [open, game?.id]);

  if (!game) return null;

  const home = game.teamA?.teamName ?? game.teamA?.name ?? game.teamAName ?? `Team A${game.teamAId ? ` #${game.teamAId}` : ""}`;
  const away = game.teamB?.teamName ?? game.teamB?.name ?? game.teamBName ?? `Team B${game.teamBId ? ` #${game.teamBId}` : ""}`;

  const { a: dbA, b: dbB } = getDbScores(game);
  const editingChanged =
    typeof aScore === "number" && typeof bScore === "number" && (dbA !== aScore || dbB !== bScore);

  async function save() {
    try {
      setBusy(true);
      setError(null);

      const a = aScore === "" ? null : Number(aScore);
      const b = bScore === "" ? null : Number(bScore);

      if (a === null || b === null || a < 0 || b < 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
        setError("Please enter valid non-negative numbers for both scores.");
        setBusy(false);
        return;
      }

      const payload = toEditPayload(game as WithOptionalRefs, a, b);

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
      setError(e instanceof Error ? e.message : "Something went wrong while saving.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add / Edit Score</DialogTitle>
          <DialogDescription>Enter the final scores then save.</DialogDescription>
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
              <div className="text-xs text-muted-foreground">New score (not saved)</div>
              <div className="text-lg font-semibold">
                {aScore} – {bScore}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={save} disabled={busy || !editingChanged} className="w-full sm:w-auto">
            {busy ? "Saving…" : "Save Score"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
