"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { Schedules } from "@/types/types";
import { useRouter } from "next/navigation";

type GameLike = Schedules & {
  teamAScore?: number | null;
  teamBScore?: number | null;
  winnerId?: number | null;
  teamAId?: number;
  teamBId?: number;
  gameType?: { gameName?: string; name?: string } | null;
  teamA?: { teamName?: string; name?: string } | null;
  teamB?: { teamName?: string; name?: string } | null;
  location?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  id: number | string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: GameLike | null;
  onSaved?: (updated: any) => void;
  onEditSchedule?: (game: GameLike) => void;
};
type GameWithScore = GameLike & {
  score?: { teamAScore?: number | null; teamBScore?: number | null };
};


export default function GameDetailsDialog({
  open,
  onOpenChange,
  game,
  onSaved,
  onEditSchedule,
}: Props) {
  const router = useRouter();

  const [mode, setMode] = React.useState<"view" | "score">("view");
  const [aScore, setAScore] = React.useState<number | "">("");
  const [bScore, setBScore] = React.useState<number | "">("");
  const [busy, setBusy] = React.useState<false | "save" | "clear" | "edit">(false);
  const [error, setError] = React.useState<string | null>(null);
  type GameWithAltNames = GameWithScore & { teamAName?: string; teamBName?: string };
  const g = game as GameWithAltNames;
  
  const getDbScores = (g: GameWithScore) => { const a = g.teamAScore ?? g.score?.teamAScore ?? null; const b = g.teamBScore ?? g.score?.teamBScore ?? null; return { a, b }; };

  React.useEffect(() => {
    if (open && game) {
      const { a, b } = getDbScores(g);
      setAScore(typeof a === "number" ? a : "");
      setBScore(typeof b === "number" ? b : "");
      setMode("view");
      setError(null);
    }
  }, [open, game?.id]);

  if (!game) return null;

  const start = new Date(g.startDate);
  const end = new Date(g.endDate);
  const sport = g.gameType?.gameName ?? g.gameType?.name ?? "-";
  const home = g.teamA?.teamName ?? g.teamA?.name ?? g.teamAName ?? `Team A${g.teamAId ? ` #${g.teamAId}` : ""}`;
  const away = g.teamB?.teamName ?? g.teamB?.name ?? g.teamBName ?? `Team B${g.teamBId ? ` #${g.teamBId}` : ""}`;
  const location = g.location ?? "TBA";

  const { a: dbA, b: dbB } = getDbScores(g);
  const hasDbScores = typeof dbA === "number" && typeof dbB === "number";

  const now = new Date();
  const status = hasDbScores ? "Finished" : start > now ? "Scheduled" : end > now ? "Ongoing" : "Finished";

  const beginScoring = () => {
    setMode("score");
    const { a, b } = getDbScores(g);
    setAScore(typeof a === "number" ? a : 0);
    setBScore(typeof b === "number" ? b : 0);
    setError(null);
  };

  const cancelScoring = () => {
    setMode("view");
    const { a, b } = getDbScores(g);
    setAScore(typeof a === "number" ? a : "");
    setBScore(typeof b === "number" ? b : "");
    setError(null);
  };

  const saveScore = async () => {
    try {
      setBusy("save");
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
      const payload = toEditPayload(g, a, b);

        const res = await fetch(`/api/games`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });


      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save score");
      }

      const updated = await res.json();
      onSaved?.(updated);
      setAScore(typeof updated.teamAScore === "number" ? updated.teamAScore : "");
      setBScore(typeof updated.teamBScore === "number" ? updated.teamBScore : "");
      setMode("view");
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong while saving.");
    } finally {
      setBusy(false);
    }
  };

  const goEditSchedule = async () => {
    try {
      setBusy("edit");
      if (onEditSchedule) {
        onEditSchedule(game);
      }
    } finally {
      setBusy(false);
    }
  };

  const editingChanged =
    mode === "score" &&
    typeof aScore === "number" &&
    typeof bScore === "number" &&
    (aScore !== dbA || bScore !== dbB);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setMode("view");
          setError(null);
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Game Details</DialogTitle>
          <DialogDescription>Quick view & actions</DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-3 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Date</span>
            <span className="col-span-2">
              {format(start, "MMM d, yyyy")} · {format(start, "h:mm a")} –{" "}
              {format(end, "h:mm a")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Sport</span>
            <span className="col-span-2">{sport}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Home</span>
            <span className="col-span-2">{home}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Away</span>
            <span className="col-span-2">{away}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Location</span>
            <span className="col-span-2">{location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Status</span>
            <span className="col-span-2">{status}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Score</span>
            <span className="col-span-2">
              {hasDbScores ? ` ${dbA} – ${dbB} ` : ""}
            </span>
          </div>

          {/* Inline editor (appears when Add Score is clicked) */}
          {mode === "score" && (
            <div className="mt-2 grid gap-3">
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
                    disabled={busy === "save" || busy === "clear"}
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
                    disabled={busy === "save" || busy === "clear"}
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          )}

          {editingChanged && (
            <div className="mt-2 rounded-md border p-3 text-center">
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
          {mode === "score" ? (
            <>
              <Button
                variant="ghost"
                onClick={cancelScoring}
                disabled={busy === "save" || busy === "clear"}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={saveScore}
                disabled={busy === "save" || busy === "clear"}
                className="w-full sm:w-auto"
              >
                {busy === "save" ? "Saving…" : "Save Score"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>

              <Button
                onClick={goEditSchedule}
                disabled={busy === "edit"}
                className="w-full sm:w-auto"
              >
                {busy === "edit" ? "Opening…" : "Edit Schedule"}
              </Button>

              <Button onClick={beginScoring} className="w-full sm:w-auto">
                Add Score
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
type WithOptionalRefs = GameLike & {
  gameTypeId?: number;
  teamAId?: number;
  teamBId?: number;
  gameType?: { id: number };
  teamA?: { id: number };
  teamB?: { id: number };
};

function toEditPayload(game: WithOptionalRefs, a: number | null, b: number | null) {
  const gameTypeId = game.gameTypeId ?? game.gameType?.id;
  const teamAId = game.teamAId ?? game.teamA?.id;
  const teamBId = game.teamBId ?? game.teamB?.id;

  if (
    typeof gameTypeId !== "number" ||
    typeof teamAId !== "number" ||
    typeof teamBId !== "number"
  ) {
    throw new Error("Missing required IDs (gameTypeId, teamAId, teamBId).");
  }

  const winnerId =
    a == null || b == null ? null : a === b ? null : a > b ? teamAId : teamBId;

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
