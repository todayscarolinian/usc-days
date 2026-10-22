"use client";

import { useEffect, useRef } from "react";
import {
  useEditGamesQuery,
  useDeleteGamesQuery,
} from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { useToastManager } from "@/src/hooks/use-toast-manager";
import { scheduleTeamFields, useScheduleForm } from "@/src/hooks/use-schedule-form";
import { isMultiTeam } from "@/src/lib/multi-team";
import {
  getEventDayKey,
  getEventTimeOfDay,
  eventDateTimeToISO,
} from "@/src/lib/time";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { EditGamePayload, EditGameSchema, hasSavedResult } from "@/src/types/games.types";
import { Schedules } from "@/src/types/types";
import { SearchableSelect, SelectOption } from "../ui/searchable-select";
import ScheduleLabelField from "./schedule-label-field";
import ParticipantTeamsField from "./participant-teams-field";
import BestOfField from "./best-of-field";
import { isSetScoring } from "@/src/lib/set-scoring";

export default function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: {
  schedule: Schedules;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  // A game keeps its sport's format, so the format is fixed for the dialog.
  const multiTeam = isMultiTeam(schedule);
  const volleyballResult = isSetScoring(schedule) && (hasSavedResult(schedule) || (schedule.sets?.length ?? 0) > 0);
  const ranked = schedule.participants.some((p) => p.rank != null);

  // Results are saved from the score or placings dialog; this keeps the stored ones.
  const storedResult: Partial<EditGamePayload> = multiTeam || isSetScoring(schedule)
    ? {}
    : {
        teamAScore:
          schedule.teamAScore !== null ? Number(schedule.teamAScore) : null,
        teamBScore:
          schedule.teamBScore !== null ? Number(schedule.teamBScore) : null,
        winnerId: schedule.winnerId ? Number(schedule.winnerId) : null,
      };

  const {
    inputs,
    updateInput,
    validationErrors,
    hasErrors,
    firstError,
    validate,
    reset,
  } = useScheduleForm({
    initialValues: {
      gameTypeId: schedule.gameType.id,
      teamAId: schedule.teamA?.id ?? null,
      teamBId: schedule.teamB?.id ?? null,
      participants: [...schedule.participants]
        .sort((a, b) => a.id - b.id)
        .map((p) => ({ key: `saved-${p.id}`, id: p.id, teamId: p.teamId, name: p.name ?? "" })),
      startDate: getEventDayKey(schedule.startDate),
      endDate: getEventDayKey(schedule.endDate),
      startTime: getEventTimeOfDay(schedule.startDate),
      endTime: getEventTimeOfDay(schedule.endDate),
      location: schedule.location ? schedule.location : undefined,
      label: schedule.label ?? "",
      bestOf: schedule.bestOf === 5 ? 5 : 3,
    },
    schema: EditGameSchema,
    transformData: (inputs) => ({
      id: schedule.id,
      gameTypeId: inputs.gameTypeId,
      ...scheduleTeamFields(inputs, multiTeam),
      startDate: eventDateTimeToISO(inputs.startDate, inputs.startTime),
      endDate: eventDateTimeToISO(inputs.endDate, inputs.endTime),
      location: inputs.location,
      label: inputs.label,
      ...storedResult,
    }),
  });

  const { showToast, dismissAll, inlineError, clearInlineError } = useToastManager({ inlineMobileErrors: true });

  // Track which errors have already been shown
  const shownErrorsRef = useRef<Set<string>>(new Set());

  const {
    data: fetchedSportsData = [],
    error: sportsError,
    isLoading: sportsLoading,
  } = getGameTypesQuery();

  const {
    data: fetchedTeamsData = [],
    error: teamsError,
    isLoading: teamLoading,
  } = getTeamsQuery();

  // Handle query errors - only show toast once per error
  useEffect(() => {
    if (sportsError && !shownErrorsRef.current.has("sportsError")) {
      showToast("error", "Failed to load sports", parseApiError(sportsError));
      shownErrorsRef.current.add("sportsError");
    }
  }, [sportsError, showToast]);

  useEffect(() => {
    if (teamsError && !shownErrorsRef.current.has("teamsError")) {
      showToast(
        "error",
        "Failed to load teams",
        parseApiError(teamsError),
      );
      shownErrorsRef.current.add("teamsError");
    }
  }, [teamsError, showToast]);

  // Reset form and dismiss toasts when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      shownErrorsRef.current.clear();
      dismissAll();
    }
  }, [open, reset, dismissAll]);

  const sportsOptions: SelectOption[] = fetchedSportsData
    .filter((sport) => sport.format === schedule.gameType.format &&
      (sport.scoringMode ?? "LINEAR") === (schedule.gameType.scoringMode ?? "LINEAR"))
    .map((sport) => ({
      value: sport.id.toString(),
      label: sport.gameName,
      id: sport.id,
    }));

  const teamChoices = fetchedTeamsData.map((team) => ({
    id: team.id,
    label: team.teamName,
  }));
  const setBased = fetchedSportsData.find(sport => sport.id === inputs.gameTypeId)?.scoringMode === "SETS";

  const teamOptions: SelectOption[] = teamChoices.map((team) => ({
    value: team.id.toString(),
    label: team.label,
    id: team.id,
  }));

  const edit = useEditGamesQuery();
  const editSchedule = () => {
    clearInlineError();
    // Validate sport selection
    if (inputs.gameTypeId <= 0) {
      showToast("error", "Please select a sport");
      return;
    }

    // Validate form inputs using EditGameSchema
    if (!validate()) {
      showToast(
        "error",
        "Validation Error",
        firstError || "Please check your inputs",
      );
      return;
    }

    const data: EditGamePayload & { id: number } = {
      id: schedule.id,
      gameTypeId: inputs.gameTypeId,
      ...scheduleTeamFields(inputs, multiTeam),
      startDate: eventDateTimeToISO(inputs.startDate, inputs.startTime),
      endDate: eventDateTimeToISO(inputs.endDate, inputs.endTime),
      location:
        inputs.location && inputs.location.trim() !== ""
          ? inputs.location
          : null,
      label: inputs.label.trim() || null,
      bestOf: setBased ? inputs.bestOf : null,
      ...storedResult,
    };

    edit.mutate(data, {
      onSuccess: () => {
        showToast(
          "success",
          "Schedule updated!",
          "The game schedule has been updated successfully.",
        );
        onOpenChange(false);
      },
      onError: (error) => {
        const errorMessage = parseApiError(error);
        showToast("error", "Failed to update schedule", errorMessage);
      },
    });
  };

  const del = useDeleteGamesQuery();
  const deleteSchedule = () => {
    clearInlineError();
    del.mutate(
      { scheduleId: schedule.id },
      {
        onSuccess: () => {
          showToast(
            "success",
            "Schedule deleted!",
            "The game schedule has been removed successfully.",
          );
          onOpenChange(false);
        },
        onError: (error) => {
          const errorMessage = parseApiError(error);
          showToast("error", "Failed to delete schedule", errorMessage);
        },
      },
    );
  };

  const loading =
    sportsLoading || teamLoading || edit.isPending || del.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onOpenChange(false);
        } else {
          onOpenChange(true);
        }
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 grid-cols-[minmax(0,1fr)] overflow-y-auto sm:max-w-150 [&_[data-slot=dialog-close]]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Edit an existing game schedule. Click Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-8 py-4">
          <div className="grid w-full grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Date
              </Label>
              <Input
                type="date"
                value={inputs.startDate ?? ""}
                onChange={(e) => {
                  updateInput("startDate", e.target.value);
                  updateInput("endDate", e.target.value);
                }}
                className={
                  validationErrors.startDate
                    ? "cursor-pointer border-red-500 focus-visible:ring-red-500"
                    : "cursor-pointer"
                }
              />
              {validationErrors.startDate && (
                <span className="text-xs text-red-500">
                  {validationErrors.startDate}
                </span>
              )}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime" className="font-bold opacity-50">
                Start Time
              </Label>
              <Input
                type="time"
                placeholder="Start Time"
                value={inputs.startTime ?? ""}
                onChange={(e) => updateInput("startTime", e.target.value)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="endTime" className="font-bold opacity-50">
                End Time
              </Label>
              <Input
                type="time"
                placeholder="End Time"
                value={inputs.endTime ?? ""}
                onChange={(e) => updateInput("endTime", e.target.value)}
                className="cursor-pointer"
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
                updateInput("gameTypeId", Number(value));
                if (multiTeam && !ranked) updateInput("participants", []);
              }}
              disabled={sportsOptions.length <= 0 || loading}
              loading={sportsLoading}
              className="w-full cursor-pointer"
            />
          </div>

          {setBased && <BestOfField value={inputs.bestOf} onChange={v => updateInput("bestOf", v)} disabled={loading || volleyballResult} />}
          {volleyballResult && <p className="text-xs text-muted-foreground">Clear the volleyball result before changing teams, sport, or match format.</p>}
          {multiTeam ? (
            <ParticipantTeamsField
              teams={teamChoices}
              value={inputs.participants}
              onChange={(entries) => updateInput("participants", entries)}
              disabled={loading}
              teamsLocked={ranked}
              loading={teamLoading}
              errors={validationErrors}
              note={ranked ? "Names can still be edited. Clear this game's results before changing its entries." : undefined}
            />
          ) : (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex w-full flex-col gap-1">
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
                  className={validationErrors.teamAId ? "cursor-pointer border-red-500" : "cursor-pointer"}
                />
                {validationErrors.teamAId && (
                  <span className="text-xs text-red-500">
                    {validationErrors.teamAId}
                  </span>
                )}
              </div>
              <span className="font-bold opacity-50">vs</span>
              <div className="flex w-full flex-col gap-1">
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
                  disabled={loading || inputs.gameTypeId <= 0}
                  loading={teamLoading}
                  className={validationErrors.teamBId ? "cursor-pointer border-red-500" : "cursor-pointer"}
                />
                {validationErrors.teamBId && (
                  <span className="text-xs text-red-500">
                    {validationErrors.teamBId}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex w-full flex-col gap-1">
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
          <ScheduleLabelField
            value={inputs.label}
            onChange={(value) => updateInput("label", value)}
            error={validationErrors.label}
          />
        </div>

        <DialogError error={inlineError} />
        <DialogFooter className="flex items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="cursor-pointer border border-tc_primary bg-transparent text-tc_primary hover:text-white"
                disabled={loading}
              >
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  schedule entry and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="cursor-pointer" onClick={deleteSchedule}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {hasErrors && (
            <span className="text-sm text-red-500 mr-auto">
              Please ensure data is correct.
            </span>
          )}
          <Button
            type="submit"
            className="cursor-pointer px-8"
            onClick={editSchedule}
            disabled={
              loading || inputs.gameTypeId <= 0 || sportsOptions.length <= 0
            }
          >
            {edit.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
