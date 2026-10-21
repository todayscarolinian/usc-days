"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { newEntryKey, type ParticipantEntryInput } from "@/src/hooks/use-schedule-form";
import { cn } from "@/src/lib/utils";
import { SearchableSelect } from "../ui/searchable-select";

export type ParticipantTeamOption = { id: number; label: string };

/**
 * The entries in a multi-team game: a team and an optional name (e.g. the swimmer) per row.
 * With `teamsLocked`, only names can change, as once a game has results.
 */
export default function ParticipantTeamsField({
  teams,
  value,
  onChange,
  disabled,
  teamsLocked,
  loading,
  errors,
  note,
}: {
  teams: ParticipantTeamOption[];
  value: ParticipantEntryInput[];
  onChange: (entries: ParticipantEntryInput[]) => void;
  disabled?: boolean;
  teamsLocked?: boolean;
  loading?: boolean;
  /** Validation errors keyed by path, e.g. "participants" or "participants.2.teamId". */
  errors: Record<string, string>;
  note?: string;
}) {
  const teamOptions = teams.map((team) => ({ value: team.id.toString(), label: team.label, id: team.id }));
  const enteredTeams = new Set(value.map((entry) => entry.teamId));
  const missingTeams = teams.filter((team) => !enteredTeams.has(team.id));
  const listError = errors.participants;

  function update(key: string, change: Partial<ParticipantEntryInput>) {
    onChange(value.map((entry) => (entry.key === key ? { ...entry, ...change } : entry)));
  }

  function addEntries(teamIds: number[]) {
    onChange([...value, ...teamIds.map((teamId) => ({ key: newEntryKey(), teamId, name: "" }))]);
  }

  return (
    <fieldset className="flex min-w-0 flex-col gap-2" disabled={disabled}>
      <div className="flex items-center justify-between gap-2">
        <legend className="text-sm font-bold opacity-50">Entries ({value.length})</legend>
        {!teamsLocked && missingTeams.length > 0 && (
          <button
            type="button"
            className="cursor-pointer text-xs text-tc_primary-500 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => addEntries(missingTeams.map((team) => team.id))}
          >
            Add every team
          </button>
        )}
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className={cn("flex max-h-80 flex-col gap-2 overflow-y-auto rounded-md border p-2", listError && "border-red-500")}>
        {loading ? (
          <p className="p-1 text-sm text-muted-foreground">Loading teams…</p>
        ) : value.length === 0 ? (
          <p className="p-1 text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          value.map((entry, index) => {
            const teamError = errors[`participants.${index}.teamId`];
            const nameError = errors[`participants.${index}.name`];
            return (
              <div key={entry.key} className="flex flex-col gap-1">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
                  <SearchableSelect
                    placeholder="Select Team"
                    searchPlaceholder="Search teams..."
                    emptyMessage="No teams found."
                    options={teamOptions}
                    value={entry.teamId > 0 ? entry.teamId.toString() : ""}
                    onValueChange={(teamId) => update(entry.key, { teamId: teamId ? Number(teamId) : -1 })}
                    disabled={disabled || teamsLocked}
                    className={teamError ? "border-red-500" : ""}
                  />
                  <Input
                    aria-label={`Name for entry ${index + 1}`}
                    placeholder="Name (optional)"
                    maxLength={100}
                    value={entry.name}
                    onChange={(e) => update(entry.key, { name: e.target.value })}
                    className={nameError ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8 cursor-pointer"
                    disabled={teamsLocked}
                    onClick={() => onChange(value.filter((other) => other.key !== entry.key))}
                    aria-label={`Remove entry ${index + 1}`}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                {(teamError || nameError) && (
                  <span className="text-xs text-red-500">{teamError ?? nameError}</span>
                )}
              </div>
            );
          })
        )}
      </div>
      {!teamsLocked && (
        <Button type="button" variant="outline" size="sm" className="cursor-pointer self-start" onClick={() => addEntries([-1])}>
          <Plus className="size-4" /> Add entry
        </Button>
      )}
      {listError && <span className="text-xs text-red-500">{listError}</span>}
    </fieldset>
  );
}
