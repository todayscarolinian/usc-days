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
import type { Schedules } from "@/types/types";

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
  onAddScore?: (game: Schedules) => void;       
};

type GameWithScore = GameLike & {
  score?: { teamAScore?: number | null; teamBScore?: number | null } | null;
};

function getDbScores(g: GameWithScore) {
  const a = g.teamAScore ?? g.score?.teamAScore ?? null;
  const b = g.teamBScore ?? g.score?.teamBScore ?? null;
  return { a, b };
}

export default function GameDetailsDialog({
  open,
  onOpenChange,
  game,
  onEditSchedule,
  onAddScore,
}: Props) {
  const [busyEdit, setBusyEdit] = React.useState(false);

  if (!game) return null;

  type WithAltNames = GameWithScore & { teamAName?: string; teamBName?: string };
  const g = game as WithAltNames;

  const start = new Date(g.startDate);
  const end = new Date(g.endDate);
  const sport = g.gameType?.gameName ?? g.gameType?.name ?? "-";
  const home =
    g.teamA?.teamName ?? g.teamA?.name ?? g.teamAName ?? `Team A${g.teamAId ? ` #${g.teamAId}` : ""}`;
  const away =
    g.teamB?.teamName ?? g.teamB?.name ?? g.teamBName ?? `Team B${g.teamBId ? ` #${g.teamBId}` : ""}`;
  const location = g.location ?? "TBA";

  const { a: dbA, b: dbB } = getDbScores(g);
  const hasDbScores = typeof dbA === "number" && typeof dbB === "number";

  const now = new Date();
  const status =
    hasDbScores ? "Finished" : start > now ? "Scheduled" : end > now ? "Ongoing" : "Finished";

  function goEditSchedule() {
    try {
      setBusyEdit(true);
      onEditSchedule?.(g);
    } finally {
      setBusyEdit(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
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
              {format(start, "MMM d, yyyy")} · {format(start, "h:mm a")} – {format(end, "h:mm a")}
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
            <span className="col-span-2">{hasDbScores ? ` ${dbA} – ${dbB} ` : ""}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          <Button onClick={goEditSchedule} disabled={busyEdit} className="w-full sm:w-auto">
            {busyEdit ? "Opening…" : "Edit Schedule"}
          </Button>

          <Button
            onClick={() => onAddScore?.(game)}
            className="w-full sm:w-auto"
          >
            Add Score
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
