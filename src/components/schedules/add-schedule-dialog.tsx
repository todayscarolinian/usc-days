"use client";

import { useEffect, useState, useRef } from "react";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/src/queries/teamgametypes.queries";
import { useAddGamesQuery } from "@/src/queries/games.queries";
import { getUserId } from "@/src/queries/auth.queries";
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
import { useInitializeUserStore, useUserStore } from "@/src/stores/user-store";
import { getTimezoneOffset } from "@/src/lib/utils";

interface ScheduleInputs {
  teamAId: number;
  teamBId: number;
  date: string;
  startTime: string;
  endTime: string;
  location?: string | undefined;
}

interface Sport {
  id: number;
  gameName: string;
}
export default function AddScheduleDialog() {
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

const defaultInputs: ScheduleInputs = {
  teamAId: -1,
  teamBId: -1,
  date: new Date().toISOString().split("T")[0],
  startTime: new Date().toISOString().split("T")[1].substring(0, 5),
  endTime: new Date(new Date().getTime() + 60 * 60 * 1000) // +1 hour
    .toISOString()
    .split("T")[1]
    .substring(0, 5),
  location: undefined,
};
  const { showToast, dismissAll } = useToastManager();

  // Track which errors have already been shown
  const shownErrorsRef = useRef<Set<string>>(new Set());

  useInitializeUserStore();
  const user = useUserStore();

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

  const {
    data: userId,
    error: userError,
    isLoading: userLoading,
  } = getUserId(user.email);

  const add = useAddGamesQuery();

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

  useEffect(() => {
    if (userError && !shownErrorsRef.current.has('userError')) {
      showToast("error", "Authentication error", parseApiError(userError));
      shownErrorsRef.current.add('userError');
    }
  }, [userError, showToast]);

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

  const teamOptions: SelectOption[] = fetchedTeamSportsData.map((team) => ({
    value: team.teamId.toString(),
    label: team.team.teamName,
    id: team.teamId,
  }));

  async function createSchedule() {
    // Validate user authentication
    if (!userId) {
      showToast("error", "Authentication required", "Please wait for authentication to complete");
      return;
    }

    // Validate sport selection
    if (inputs.gameTypeId <= 0) {
      showToast("error", "Please select a sport");
      return;
    }

    // Validate form inputs using existing AddGameSchema
    if (!validate(userId)) {
      showToast("error", "Validation Error", firstError || "Please check your inputs");
      return;
    }

    let endDate = new Date(`${scheduleInputs.date}T${scheduleInputs.endTime}:00+08:00`)
    endDate.setDate(endDate.getDate() + 1)  // Plus One Day

    const data: AddGamePayload = {
      gameTypeId: inputs.gameTypeId,
      teamAId: inputs.teamAId,
      teamBId: inputs.teamBId,
      startDate: `${inputs.startDate}T${inputs.startTime}:00${getTimezoneOffset()}`,
      endDate: `${inputs.endDate}T${inputs.endTime}:00${getTimezoneOffset()}`,
      location: inputs.location || undefined,
      createdById: userId,
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

  const loading = sportsLoading || teamLoading || userLoading || add.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="bg-tc_primary-500 hover:bg-tc_primary-600">
          Add Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>
            Add a new game schedule. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Start Date
              </Label>
              <Input
                type="date"
                value={inputs.startDate}
                onChange={(e) => updateInput("startDate", e.target.value)}
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
            <div className="flex flex-col gap-1">
              <Label htmlFor="date" className="font-bold opacity-50">
                Date
              </Label>
              <Input
                type="date"
                value={inputs.endDate}
                onChange={(e) => updateInput("endDate", e.target.value)}
                className={
                  validationErrors.endDate
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {validationErrors.endDate && (
                <span className="text-xs text-red-500">
                  {validationErrors.endDate}
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
              onValueChange={(value) =>
                updateInput("gameTypeId", value ? Number(value) : -1)
              }
              disabled={loading}
              loading={sportsLoading}
              className="w-full"
            />
          </div>
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
            <div className="flex flex-col gap-1 w-full">
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
            disabled={!userId || inputs.gameTypeId <= 0 || loading}
          >
            {add.isPending ? "Creating..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}