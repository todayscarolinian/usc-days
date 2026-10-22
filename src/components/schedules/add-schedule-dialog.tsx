"use client";

import { useEffect, useState, useRef, useId } from "react";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamsQuery } from "@/src/queries/teams.queries";
import { useAddGamesQuery } from "@/src/queries/games.queries";
import { parseApiError } from "@/src/lib/error-handler";
import { scheduleTeamFields, useScheduleForm } from "@/src/hooks/use-schedule-form";
import { useToastManager } from "@/src/hooks/use-toast-manager";

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

import { AddGamePayload } from "@/src/types/games.types";
import { SearchableSelect, SelectOption } from "../ui/searchable-select";
import { cn } from "@/src/lib/utils";
import { Plus } from "lucide-react";
import { eventDateTimeToISO } from "@/src/lib/time";
import ScheduleLabelField from "./schedule-label-field";
import ParticipantTeamsField from "./participant-teams-field";
import BestOfField from "./best-of-field";

const SCHEDULE_LOCATIONS = [
  "Bunzel Lobby, Talamban Campus",
  "Domain Talamban Branch, Talamban Campus",
  "AB Gymnasium, Downtown Campus",
  "Tennis Court, Downtown Campus",
  "AB Basement, Downtown Campus",
  "BCT 1, Talamban Campus",
  "BCT 2, Talamban Campus",
  "USC Stadium, Talamban Campus",
  "AB 202 (Court 1), Downtown Campus",
  "AB 202 (Court 2), Downtown Campus",
  "Pelota Court, Downtown Campus",
  "Swimming Pool, Downtown Campus",
];

export default function AddScheduleDialog({ compactTrigger = false }: {
  compactTrigger?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sportId = useId();
  const locationId = useId();

  const {
    inputs,
    updateInput,
    validationErrors,
    hasErrors,
    firstError,
    validate,
    reset,
  } = useScheduleForm();

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

  const add = useAddGamesQuery();

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
      dismissAll();
      shownErrorsRef.current.clear();
    }
  }, [open, reset, dismissAll]);

  const sportsOptions: SelectOption[] = fetchedSportsData.map((sport) => ({
    value: sport.id.toString(),
    label: sport.gameName,
    id: sport.id,
  }));

  const multiTeam =
    fetchedSportsData.find((sport) => sport.id === inputs.gameTypeId)?.format === "MULTI_TEAM";
  const setBased = fetchedSportsData.find(sport => sport.id === inputs.gameTypeId)?.scoringMode === "SETS";

  const teamChoices = fetchedTeamsData.map((team) => ({
    id: team.id,
    label: team.teamName,
  }));

  const teamOptions: SelectOption[] = teamChoices.map((team) => ({
    value: team.id.toString(),
    label: team.label,
    id: team.id,
  }));

  async function createSchedule() {
    clearInlineError();

    // Validate sport selection
    if (inputs.gameTypeId <= 0) {
      showToast("error", "Please select a sport");
      return;
    }

    // Validate form inputs using existing AddGameSchema
    if (!validate({ multiTeam })) {
      showToast(
        "error",
        "Validation Error",
        firstError || "Please check your inputs",
      );
      return;
    }

    const data: AddGamePayload = {
      gameTypeId: inputs.gameTypeId,
      ...scheduleTeamFields(inputs, multiTeam),
      startDate: eventDateTimeToISO(inputs.startDate, inputs.startTime),
      endDate: eventDateTimeToISO(inputs.endDate, inputs.endTime),
      location: inputs.location || undefined,
      label: inputs.label.trim() || null,
      bestOf: setBased ? inputs.bestOf : null,
    };

    add.mutate(data, {
      onSuccess: () => {
        showToast(
          "success",
          "Schedule created!",
          "The game schedule has been added successfully.",
        );
        setOpen(false);
      },
      onError: (error) => {
        const errorMessage = parseApiError(error);
        showToast("error", "Failed to create schedule", errorMessage);
      },
    });
  }

  const loading = sportsLoading || teamLoading || add.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className={cn(
          "cursor-pointer bg-tc_primary-500 hover:bg-tc_primary-600",
          compactTrigger && "size-10 p-0 sm:h-9 sm:w-auto sm:px-3",
        )}>
          {compactTrigger && <Plus className="size-4" aria-hidden="true" />}
          <span className={compactTrigger ? "sr-only sm:not-sr-only" : undefined}>
            Add Schedule
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 grid-cols-[minmax(0,1fr)] overflow-y-auto p-4 sm:max-w-150 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl">Add Schedule</DialogTitle>
          <DialogDescription>
            Add a new game schedule. Click Submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 py-4 sm:gap-8">
          <div className="w-full grid grid-cols-1 gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Date
              </Label>
              <Input
                type="date"
                value={inputs.startDate}
                onChange={(e) => {
                  updateInput("startDate", e.target.value);
                  updateInput("endDate", e.target.value);
                }}
                className={cn(
                  "max-w-full",
                  validationErrors.startDate && "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {validationErrors.startDate && (
                <span className="text-xs text-red-500">
                  {validationErrors.startDate}
                </span>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <Label htmlFor="startTime" className="font-bold opacity-50">
                Start Time
              </Label>
              <Input
                 type="time"
                className="max-w-full"
                value={inputs.startTime}
                onChange={(e) => updateInput("startTime", e.target.value)}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <Label htmlFor="endTime" className="font-bold opacity-50">
                End Time
              </Label>
              <Input
                 type="time"
                className="max-w-full"
                value={inputs.endTime}
                onChange={(e) => updateInput("endTime", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label htmlFor={sportId} className="font-bold opacity-50">
              Sport
            </Label>
            <SearchableSelect
              id={sportId}
              placeholder="Select a Sport"
              searchPlaceholder="Search sports..."
              emptyMessage="No sports found."
              options={sportsOptions}
              value={inputs.gameTypeId > 0 ? inputs.gameTypeId.toString() : ""}
              onValueChange={(value) => {
                updateInput("gameTypeId", value ? Number(value) : -1);
                updateInput("teamAId", null);
                updateInput("teamBId", null);
                updateInput("participants", []);
              }}
              disabled={loading}
              loading={sportsLoading}
              className="w-full"
            />
          </div>
          {inputs.gameTypeId <= 0 && (
            <p className="text-sm text-muted-foreground">Select a sport to choose teams.</p>
          )}
          {setBased && <BestOfField value={inputs.bestOf} onChange={v => updateInput("bestOf", v)} disabled={loading} />}
          {multiTeam ? (
            <ParticipantTeamsField
              teams={teamChoices}
              value={inputs.participants}
              onChange={(entries) => updateInput("participants", entries)}
              disabled={loading}
              loading={teamLoading}
              errors={validationErrors}
            />
          ) : (
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
              <div className="flex min-w-0 flex-col gap-1">
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
              <div className="flex min-w-0 flex-col gap-1">
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
          )}
          <div className="w-full flex flex-col gap-1">
            <Label htmlFor={locationId} className="font-bold opacity-50">
              Location
            </Label>
            <SearchableSelect
              id={locationId}
              placeholder="Select or type a location"
              searchPlaceholder="Search or type a new location..."
              groupLabel="Locations"
              options={SCHEDULE_LOCATIONS.map(location => ({ value: location, label: location }))}
              allowCustom
              clearable
              value={inputs.location || ""}
              onValueChange={(value) => updateInput("location", value)}
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
          {hasErrors && (
            <span className="text-sm text-red-500 mr-auto">
              Please ensure data is correct.
            </span>
          )}
          <Button
            type="submit"
            onClick={createSchedule}
            disabled={inputs.gameTypeId <= 0 || loading}
          >
            {add.isPending ? "Creating..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
