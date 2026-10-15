"use client";

import { useEffect, useState, useRef } from "react";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/src/queries/teamgametypes.queries";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import { useAddGamesQuery } from "@/src/queries/games.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { useScheduleForm } from "@/src/hooks/use-schedule-form";
import { useToastManager } from "@/src/hooks/use-toast-manager";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import { AddGamePayload } from "@/src/types/games.types";
import { SearchableSelect, SelectOption } from "../ui/searchable-select";
import { cn, getTimezoneOffset } from "@/src/lib/utils";
import { Plus } from "lucide-react";

export default function AddScheduleDialog({ compactTrigger = false, preview = false }: {
  compactTrigger?: boolean;
  preview?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const {
    inputs,
    updateInput,
    validationErrors,
    hasErrors,
    firstError,
    validate,
    reset,
  } = useScheduleForm();

  const { showToast, dismissAll } = useToastManager();

  // Track which errors have already been shown
  const shownErrorsRef = useRef<Set<string>>(new Set());

  const {
    data: fetchedSportsData = [],
    error: sportsError,
    isLoading: sportsLoading,
  } = getGameTypesQuery();

  const {
    data: fetchedTeamSportsData = [],
    error: teamSportsError,
    isLoading: teamLoading,
  } = getTeamGameTypesQuery(inputs.gameTypeId > 0 ? inputs.gameTypeId : 0);

  const add = useAddGamesQuery();
  const teams = getTeamsQuery();
  const useAllTeams = inputs.gameTypeId > 0 && !teamLoading && !teamSportsError && fetchedTeamSportsData.length === 0;

  // Handle query errors - only show toast once per error
  useEffect(() => {
    if (sportsError && !shownErrorsRef.current.has('sportsError')) {
      showToast("error", "Failed to load sports", parseApiError(sportsError));
      shownErrorsRef.current.add('sportsError');
    }
  }, [sportsError, showToast]);

  useEffect(() => {
    if (teamSportsError && !shownErrorsRef.current.has('teamSportsError')) {
      showToast("error", "Failed to load teams", parseApiError(teamSportsError));
      shownErrorsRef.current.add('teamSportsError');
    }
  }, [teamSportsError, showToast]);

  // Reset form and dismiss toasts when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      dismissAll();
      shownErrorsRef.current.clear();
    }
  }, [open, reset, dismissAll]);

  const sportsOptions: SelectOption[] = fetchedSportsData.map((sport) => ({
    value: sport.id.toString(),
    label: sport.gameName,
    id: sport.id,
  }));

  const teamOptions: SelectOption[] = useAllTeams ? (teams.data ?? []).map((team) => ({
    value: team.id.toString(),
    label: team.teamName,
    id: team.id,
  })) : fetchedTeamSportsData.map((team) => ({
    value: team.teamId.toString(),
    label: team.team.teamName,
    id: team.teamId,
  }));

  async function createSchedule() {
    if (preview) return;

    // Validate sport selection
    if (inputs.gameTypeId <= 0) {
      showToast("error", "Please select a sport");
      return;
    }

    // Validate form inputs using existing AddGameSchema
    if (!validate()) {
      showToast("error", "Validation Error", firstError || "Please check your inputs");
      return;
    }

    const data: AddGamePayload = {
      gameTypeId: inputs.gameTypeId,
      teamAId: inputs.teamAId,
      teamBId: inputs.teamBId,
      startDate: `${inputs.startDate}T${inputs.startTime}:00${getTimezoneOffset()}`,
      endDate: `${inputs.endDate}T${inputs.endTime}:00${getTimezoneOffset()}`,
      location: inputs.location || undefined,
    };

    add.mutate(data, {
      onSuccess: () => {
        showToast(
          "success",
          "Schedule created!",
          "The game schedule has been added successfully."
        );
        setOpen(false);
      },
      onError: (error) => {
        const errorMessage = parseApiError(error);
        showToast("error", "Failed to create schedule", errorMessage);
      },
    });
  }

  const loading = sportsLoading || teamLoading || (useAllTeams && teams.isPending) || add.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className={cn(
          "bg-tc_primary-500 hover:bg-tc_primary-600",
          compactTrigger && "size-10 p-0 sm:h-9 sm:w-auto sm:px-3",
        )}>
          {compactTrigger && <Plus className="size-4" aria-hidden="true" />}
          <span className={compactTrigger ? "sr-only sm:not-sr-only" : undefined}>
            {preview ? "Preview Schedule" : "Add Schedule"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>
            {preview
              ? "Preview only. You can try the form, but schedules won’t be saved."
              : <>Add a new game schedule. Click Submit when you&apos;re done.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="w-full grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Date
              </Label>
              <Input
                type="date"
                value={inputs.startDate}
                onChange={(e) => { updateInput("startDate", e.target.value)
                    updateInput("endDate", e.target.value) }}
                className={
                  validationErrors.startDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {validationErrors.startDate && (
                <span className="text-xs text-red-500">
                  {validationErrors.startDate}
                </span>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime" className="font-bold opacity-50">
                Start Time
              </Label>
              <Input
                type="time"
                value={inputs.startTime}
                onChange={(e) => updateInput("startTime", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="endTime" className="font-bold opacity-50">
                End Time
              </Label>
              <Input
                type="time"
                value={inputs.endTime}
                onChange={(e) => updateInput("endTime", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full">
            <SearchableSelect
              placeholder="Select a Sport"
              searchPlaceholder="Search sports..."
              emptyMessage="No sports found."
              options={sportsOptions}
              value={inputs.gameTypeId > 0 ? inputs.gameTypeId.toString() : ""}
              onValueChange={(value) => {
                updateInput("gameTypeId", value ? Number(value) : -1);
                updateInput("teamAId", null);
                updateInput("teamBId", null);
              }}
              disabled={loading}
              loading={sportsLoading}
              className="w-full"
            />
          </div>
          {inputs.gameTypeId <= 0 && (
            <p className="text-sm text-muted-foreground">Select a sport to choose teams.</p>
          )}
          {useAllTeams && !teams.isPending && !teams.isError && (
            <p className="text-sm text-muted-foreground">No teams are registered for this sport yet. Showing all existing teams.</p>
          )}
          {useAllTeams && teams.isError && (
            <div role="alert" className="text-sm text-destructive">
              Could not load teams. <button type="button" className="underline" onClick={() => void teams.refetch()}>Try again</button>
            </div>
          )}
          <div className="w-full flex justify-between items-center gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="teamA" className="font-bold opacity-50">
                Team
              </Label>
              <SearchableSelect
                placeholder="Select Team"
                searchPlaceholder="Search teams..."
                emptyMessage="No teams found."
                options={teamOptions}
                clearable
                value={inputs.teamAId != null ? inputs.teamAId.toString() : ""}
                onValueChange={(value) =>
                  updateInput("teamAId", value ? Number(value) : null)
                }
                disabled={inputs.gameTypeId <= 0 || loading}
                loading={teamLoading}
                className={validationErrors.teamAId ? "border-red-500" : ""}
              />
              {validationErrors.teamAId && (
                <span className="text-xs text-red-500">
                  {validationErrors.teamAId}
                </span>
              )}
            </div>
            <span className="font-bold opacity-50">vs</span>
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="teamB" className="font-bold opacity-50">
                Team
              </Label>
              <SearchableSelect
                placeholder="Select Team"
                searchPlaceholder="Search teams..."
                emptyMessage="No teams found."
                options={teamOptions}
                clearable
                value={inputs.teamBId != null ? inputs.teamBId.toString() : ""}
                onValueChange={(value) =>
                  updateInput("teamBId", value ? Number(value) : null)
                }
                disabled={inputs.gameTypeId <= 0 || loading}
                loading={teamLoading}
                className={validationErrors.teamBId ? "border-red-500" : ""}
              />
              {validationErrors.teamBId && (
                <span className="text-xs text-red-500">
                  {validationErrors.teamBId}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label htmlFor="location" className="font-bold opacity-50">
              Location
            </Label>
            <Input
              type="text"
              placeholder="Location"
              value={inputs.location || ""}
              onChange={(e) => updateInput("location", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center">
          {hasErrors && (
            <span className="text-sm text-red-500 mr-auto">
              Please ensure data is correct.
            </span>
          )}
          <Button
            type="submit"
            onClick={createSchedule}
            disabled={preview || inputs.gameTypeId <= 0 || loading}
          >
            {add.isPending ? "Creating..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
