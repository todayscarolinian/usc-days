"use client";

import { useState } from "react";
import {
  useEditGamesQuery,
  useDeleteGamesQuery,
} from "@/src/queries/games.queries";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/src/queries/teamgametypes.queries";
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
import { EditGamePayload, DeleteGamePayload } from "@/src/types/games.types";
import { Schedules } from "@/src/types/types";
import { getSportsTeamData } from "@/src/lib/actions";
import { SearchableSelect, SelectOption } from "./searchable-select";

interface ScheduleInputs {
  teamAId: number;
  teamBId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string | undefined;
}

interface Sport {
  id: number;
  gameName: string;
}

interface SportTeam {
  id: number;
  gameTypeId: number;
  teamId: number;
  team: {
    teamName: string;
  };
}

export default function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: {
  schedule: Schedules;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const defaultInputs: ScheduleInputs = {
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
    };
    
  const [selectedSport, setSelectedSport] = useState<number>(
    schedule.gameType.id
  );
  const [scheduleInputs, setScheduleInputs] =
    useState<ScheduleInputs>(defaultInputs);

  const {
    data: fetchedSportsData = [],
    error: sportsError,
    isLoading: sportsLoading,
  } = getGameTypesQuery();

  const {
    data: fetchedTeamSportsData = [],
    error: teamSportsError,
    isLoading: teamLoading,
  } = getTeamGameTypesQuery(Number(selectedSport));

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
    if (!selectedSport) return;
    const data: EditGamePayload = {
      id: schedule.id,
      gameTypeId: selectedSport,
      teamAId: scheduleInputs.teamAId,
      teamBId: scheduleInputs.teamBId,
      startDate: `${scheduleInputs.startDate}T${scheduleInputs.startTime}:00+08:00`,
      endDate: `${scheduleInputs.endDate}T${scheduleInputs.endTime}:00+08:00`,
      location: scheduleInputs.location ? scheduleInputs.location : undefined,
      teamAScore: schedule.teamAScore,
      teamBScore: schedule.teamBScore,
    };

    edit.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const del = useDeleteGamesQuery();
  const deleteSchedule = () => {
    del.mutate(
      { scheduleId: schedule.id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const loading =
    sportsLoading || teamLoading || edit.isPending || del.isPending;
  const error = sportsError || teamSportsError || edit.error || del.error;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setSelectedSport(schedule.gameType.id);
          setScheduleInputs({
            teamAId: schedule.teamA.id,
            teamBId: schedule.teamB.id,
            startDate: new Date(schedule.startDate).toLocaleDateString(
              "en-CA",
              {
                timeZone: "Asia/Manila",
              }
            ),
            endDate: new Date(schedule.endDate).toLocaleDateString("en-CA", {
              timeZone: "Asia/Manila",
            }),
            startTime: new Date(schedule.startDate).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Manila",
              }
            ),
            endTime: new Date(schedule.endDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Manila",
            }),
            location: schedule.location ? schedule.location : undefined,
          });
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
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Start Date
              </Label>
              <Input
                type="date"
                placeholder="Start Date"
                value={scheduleInputs.startDate ?? ""}
                onChange={(e) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="endDate" className="font-bold opacity-50">
                End Date
              </Label>
              <Input
                type="date"
                placeholder="End Date"
                value={scheduleInputs.endDate ?? ""}
                onChange={(e) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    endDate: e.target.value,
                  }))
                }
              />
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
                value={scheduleInputs.startTime ?? ""}
                onChange={(e) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    startTime: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="endTime" className="font-bold opacity-50">
                End Time
              </Label>
              <Input
                type="time"
                placeholder="End Time"
                value={scheduleInputs.endTime ?? ""}
                onChange={(e) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    endTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="w-full">
            <SearchableSelect
              placeholder="Select a Sport"
              searchPlaceholder="Search sports..."
              emptyMessage="No sports found."
              options={sportsOptions}
              value={selectedSport.toString()}
              onChange={(value) => setSelectedSport(Number(value))}
              disabled={sportsOptions.length <= 0 || sportsLoading}
              width="w-full"
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
                value={scheduleInputs.teamAId.toString()}
                onChange={(value) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    teamAId: Number(value),
                  }))
                }
                disabled={teamOptions.length <= 0 || teamLoading}
              />
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
                value={scheduleInputs.teamBId.toString()}
                onChange={(value) =>
                  setScheduleInputs((s) => ({
                    ...s,
                    teamBId: Number(value),
                  }))
                }
                disabled={teamOptions.length <= 0 || teamLoading}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <Label htmlFor="location" className="font-bold opacity-50">
              Location
            </Label>
            <Input
              type="text"
              placeholder="Location"
              value={scheduleInputs.location ?? ""}
              onChange={(e) =>
                setScheduleInputs((s) => ({
                  ...s,
                  location: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter className="flex items-center">
          {error && <span className="text-red-500">{error?.message}</span>}

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

          <Button
            type="submit"
            className="px-8"
            onClick={editSchedule}
            disabled={
              loading || teamOptions.length <= 0 || sportsOptions.length <= 0
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
