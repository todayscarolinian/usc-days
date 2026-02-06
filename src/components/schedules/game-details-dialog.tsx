"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import type { Schedules } from "@/src/types/types";
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: Schedules | null;
  onSaved?: (updated: Schedules) => void;
  onEditSchedule?: (game: Schedules) => void;
  onAddScore?: (game: Schedules) => void;
};

function getDbScores(g: Schedules) {
  const a = g.teamAScore ?? null;
  const b = g.teamBScore ?? null;
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

  useInitializeUserStore();
  const { email } = useUserStore();

  if (!game) return null;
  const s = game;
  const start = new Date(game.startDate);
  const end = new Date(game.endDate);
  const sport = game.gameType?.gameName ?? "-";
  const home = game.teamA.teamName ?? "-";
  const away = game.teamB.teamName ?? "-";
  const location = game.location ?? "TBA";

  const { a: dbA, b: dbB } = getDbScores(game);

  const now = new Date();
  const status =
    dbA && dbB
      ? "Finished"
      : start > now
      ? "Scheduled"
      : end > now
      ? "Ongoing"
      : "Finished";

  function goEditSchedule() {
    try {
      setBusyEdit(true);
      onEditSchedule?.(s);
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
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="text-xl">Game Details</DialogTitle>
          <DialogDescription>Quick view & actions</DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-3 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Date</span>
            <span className="col-span-2">
              {format(start, "MMM d, yyyy")} · {format(start, "h:mm a")} -{" "}
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
              {dbA && dbB ? ` ${dbA} - ${dbB} ` : ""}
            </span>
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

          {email && (
            <>
              <Button
                onClick={goEditSchedule}
                disabled={busyEdit}
                className="w-full sm:w-auto"
              >
                {busyEdit ? "Opening…" : "Edit Schedule"}
              </Button>

              <Button
                onClick={() => onAddScore?.(game)}
                className="w-full sm:w-auto"
              >
                Add Score
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
