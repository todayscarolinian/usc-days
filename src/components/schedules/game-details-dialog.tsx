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
import type { Schedules } from "@/src/types/types";
import { SCORES_REQUIRE_TEAMS_MESSAGE } from "@/src/types/games.types";
import { useHasHeraldDomainAccess } from "@/src/lib/herald/use-has-domain-access";
import { GAME_STATUS_LABELS, getGameStatus } from "@/src/lib/game-status";
import { SCHEDULE_TIME_ZONE } from "@/src/lib/schedules";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: Schedules | null;
  onSaved?: (updated: Schedules) => void;
  onEditSchedule?: (game: Schedules) => void;
  onAddScore?: (game: Schedules) => void;
  now?: Date;
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
  now = new Date(),
}: Props) {
  const [busyEdit, setBusyEdit] = React.useState(false);

  const { hasAccess } = useHasHeraldDomainAccess();

  if (!game) return null;
  const s = game;
  const start = new Date(game.startDate);
  const end = new Date(game.endDate);
  const sport = game.gameType?.gameName ?? "-";
  const home = game.teamA?.teamName ?? "TBD";
  const away = game.teamB?.teamName ?? "TBD";
  const teamsAreSet = game.teamA != null && game.teamB != null;
  const location = game.location ?? "TBA";

  const { a: dbA, b: dbB } = getDbScores(game);
  const status = GAME_STATUS_LABELS[getGameStatus(game, now)];
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE, month: "short", day: "numeric", year: "numeric",
  }).format(start);
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE, hour: "numeric", minute: "2-digit",
  });

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
              {dateLabel} · {timeFormatter.format(start)} -{" "}
              {timeFormatter.format(end)}
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
              {game.teamAForfeited ? "X" : dbA == null ? "-" : Number(dbA)} /{" "}
              {game.teamBForfeited ? "X" : dbB == null ? "-" : Number(dbB)}
            </span>
          </div>
        </div>

        {hasAccess && !teamsAreSet && (
          <p className="text-sm text-muted-foreground">
            {SCORES_REQUIRE_TEAMS_MESSAGE}
          </p>
        )}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          {hasAccess && (
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
                disabled={!teamsAreSet}
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
