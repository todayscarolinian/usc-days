"use client";

import { useEffect, useRef } from "react";
import {
  useEditGamesQuery,
  useDeleteGamesQuery,
} from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/src/queries/teamgametypes.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { useToastManager } from "@/src/hooks/use-toast-manager";
import { useScheduleForm } from "@/src/hooks/use-schedule-form";
import { getTimezoneOffset } from "@/src/lib/utils";
import { FaRegEdit } from "react-icons/fa";

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
import { EditGamePayload, EditGameSchema } from "@/src/types/games.types";
import { Schedules } from "@/src/types/types";
import { SearchableSelect, SelectOption } from "../ui/searchable-select";

export default function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: {
  schedule: Schedules;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
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
      teamAId: schedule.teamA.id,
      teamBId: schedule.teamB.id,
      startDate: new Date(schedule.startDate).toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      }),
      endDate: new Date(schedule.endDate).toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      }),
      startTime: new Date(schedule.startDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      }),
      endTime: new Date(schedule.endDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Manila",
      }),
      location: schedule.location ? schedule.location : undefined,
    },
    schema: EditGameSchema,
    transformData: (inputs) => ({
      id: schedule.id,
      gameTypeId: inputs.gameTypeId,
      teamAId: inputs.teamAId,
      teamBId: inputs.teamBId,
      startDate: `${inputs.startDate}T${inputs.startTime}:00${getTimezoneOffset()}`,
      endDate: `${inputs.endDate}T${inputs.endTime}:00${getTimezoneOffset()}`,
      location: inputs.location,
      teamAScore: schedule.teamAScore !== null ? Number(schedule.teamAScore) : null,
      teamBScore: schedule.teamBScore !== null ? Number(schedule.teamBScore) : null,
      winnerId: schedule.winnerId ? Number(schedule.winnerId) : null,
    }),
  });

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
  } = getTeamGameTypesQuery(Number(inputs.gameTypeId));

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
      shownErrorsRef.current.clear();
      dismissAll();
    }
  }, [open, reset, dismissAll]);

  const sportsOptions: SelectOption[] = fetchedSportsData.map((sport) => ({
    value: sport.id.toString(),
    label: sport.gameName,
    id: sport.id,
  }));

  const teamOptions: SelectOption[] = fetchedTeamSportsData.map((team) => ({
    value: team.teamId.toString(),
    label: team.team.teamName,
    id: team.teamId,
  }));

  const edit = useEditGamesQuery();
  const editSchedule = () => {
    // Validate sport selection
    if (inputs.gameTypeId <= 0) {
      showToast("error", "Please select a sport");
      return;
    }

    // Validate form inputs using EditGameSchema
    if (!validate()) {
      showToast("error", "Validation Error", firstError || "Please check your inputs");
      return;
    }

    const data: EditGamePayload = {
      id: schedule.id,
      gameTypeId: inputs.gameTypeId,
      teamAId: inputs.teamAId,
      teamBId: inputs.teamBId,
      startDate: `${inputs.startDate}T${inputs.startTime}:00${getTimezoneOffset()}`,
      endDate: `${inputs.endDate}T${inputs.endTime}:00${getTimezoneOffset()}`,
      location: inputs.location ? inputs.location : undefined,
      teamAScore: schedule.teamAScore !== null ? Number(schedule.teamAScore) : null,
      teamBScore: schedule.teamBScore !== null ? Number(schedule.teamBScore) : null,
      winnerId: schedule.winnerId ? Number(schedule.winnerId) : null,
    };

    edit.mutate(data, {
      onSuccess: () => {
        showToast(
          "success",
          "Schedule updated!",
          "The game schedule has been updated successfully."
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
    del.mutate(
      { scheduleId: schedule.id },
      {
        onSuccess: () => {
          showToast(
            "success",
            "Schedule deleted!",
            "The game schedule has been removed successfully."
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
      <DialogTrigger className="text-primary-foreground bg-[#9B2626] hover:bg-[#771D1D] h-9 rounded-md px-3">
        <FaRegEdit />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
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
              onValueChange={(value) => updateInput("gameTypeId", Number(value))}
              disabled={sportsOptions.length <= 0 || loading}
              loading={sportsLoading}
              className="w-full"
            />
          </div>

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
                value={inputs.teamAId !== -1 ? inputs.teamAId.toString() : ""}
                onValueChange={(value) =>
                  updateInput("teamAId", value ? Number(value) : -1)
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
            <div className="flex w-full flex-col gap-1">
              <Label htmlFor="teamB" className="font-bold opacity-50">
                Team
              </Label>
              <SearchableSelect
                placeholder="Select Team"
                searchPlaceholder="Search teams..."
                emptyMessage="No teams found."
                options={teamOptions}
                value={inputs.teamBId !== -1 ? inputs.teamBId.toString() : ""}
                onValueChange={(value) =>
                  updateInput("teamBId", value ? Number(value) : -1)
                }
                disabled={loading || inputs.gameTypeId <= 0}
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
        </div>

        <DialogFooter className="flex items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="bg-transparent border border-tc_primary text-tc_primary hover:text-white"
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
                <AlertDialogAction onClick={deleteSchedule}>
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
            className="px-8"
            onClick={editSchedule}
            disabled={loading || inputs.gameTypeId <= 0 || sportsOptions.length <= 0}
          >
            {edit.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
