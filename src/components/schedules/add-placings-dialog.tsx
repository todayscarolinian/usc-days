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
import { useSaveResultsQuery } from "@/src/queries/games.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { entryLabels, sortedParticipants } from "@/src/lib/multi-team";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  game: Schedules;
};

type Ranks = Record<number, number | "">;

function storedRanks(game: Schedules): Ranks {
  return Object.fromEntries(game.participants.map((p) => [p.id, p.rank ?? ""]));
}

/** Ranks every entry in a multi-team game. Ties are allowed; a blank rank did not finish. */
export default function AddPlacingsDialog({ open, onOpenChange, game }: Props) {
  const [ranks, setRanks] = React.useState<Ranks>(() => storedRanks(game));
  const [error, setError] = React.useState<string | null>(null);
  const saveResults = useSaveResultsQuery();

  React.useEffect(() => {
    if (open) {
      setRanks(storedRanks(game));
      setError(null);
    }
  }, [open, game]);

  const participants = sortedParticipants(game);
  const labels = entryLabels(game);
  const hasStoredResult = game.participants.some((p) => p.rank != null);
  const changed = game.participants.some((p) => (p.rank ?? "") !== ranks[p.id]);

  async function submit(results: { participantId: number; rank: number | null }[]) {
    setError(null);
    try {
      await saveResults.mutateAsync({ id: game.id, results });
      onOpenChange(false);
    } catch (e: unknown) {
      setError(parseApiError(e));
    }
  }

  function save() {
    const results = game.participants.map((p) => {
      const rank = ranks[p.id];
      return { participantId: p.id, rank: rank === "" ? null : rank };
    });

    if (results.some((r) => r.rank != null && (!Number.isInteger(r.rank) || r.rank < 1))) {
      setError("Ranks must be whole numbers starting from 1.");
      return;
    }
    if (results.every((r) => r.rank == null)) {
      setError("Rank at least one entry, or use Clear results.");
      return;
    }
    void submit(results);
  }

  function clearResults() {
    void submit(game.participants.map((p) => ({ participantId: p.id, rank: null })));
  }

  if (participants.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] [&_[data-slot=dialog-close]]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Add / Edit Placings</DialogTitle>
            <DialogDescription>
              Add teams to this game before entering placings.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[520px] [&_[data-slot=dialog-close]]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Add / Edit Placings</DialogTitle>
          <DialogDescription>
            Enter each entry&apos;s finishing place. Entries can share a place; leave an
            entry blank if it did not finish.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {participants.map(({ id: participantId }) => {
            const id = `placing-${participantId}`;
            return (
              <div key={participantId} className="grid grid-cols-3 items-center gap-2">
                <label htmlFor={id} className="col-span-2 truncate text-muted-foreground">
                  {labels.get(participantId)}
                </label>
                <Input
                  id={id}
                  inputMode="numeric"
                  type="number"
                  placeholder="DNF"
                  min={1}
                  step={1}
                  value={ranks[participantId] ?? ""}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setRanks((prev) => ({ ...prev, [participantId]: v === "" ? "" : Number(v) }));
                  }}
                  disabled={saveResults.isPending}
                />
              </div>
            );
          })}

          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {hasStoredResult && (
            <Button
              variant="outline"
              onClick={clearResults}
              disabled={saveResults.isPending}
              className="w-full cursor-pointer sm:mr-auto sm:w-auto"
            >
              Clear results
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saveResults.isPending}
            className="w-full cursor-pointer sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={saveResults.isPending || !changed}
            className="w-full cursor-pointer sm:w-auto"
          >
            {saveResults.isPending ? "Saving…" : "Save Placings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
