"use client";

import { useEffect, useState } from "react";
import { getGameTypesQuery } from "@/src/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/src/queries/teamgametypes.queries";
import { useAddGamesQuery } from "@/src/queries/games.queries";
import { getUserId } from "@/src/queries/auth.queries";
import axios from "axios";

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

const defaultInputs: ScheduleInputs = {
  teamAId: -1,
  teamBId: -1,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  startTime: new Date().toISOString().split("T")[1].substring(0, 5),
  endTime: new Date(new Date().getTime() + 60 * 60 * 1000) // +1 hour
    .toISOString()
    .split("T")[1]
    .substring(0, 5),
  location: undefined,
};

export default function AddScheduleDialog() {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [scheduleInputs, setScheduleInputs] =
    useState<ScheduleInputs>(defaultInputs);

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
  } = getTeamGameTypesQuery(Number(selectedSport));

  const {
    data: userId,
    error: userError,
    isLoading: userLoading,
  } = getUserId(user.email);

  const add = useAddGamesQuery();

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
    if (!selectedSport) return;

    const data: AddGamePayload = {
      gameTypeId: selectedSport,
      teamAId: scheduleInputs.teamAId,
      teamBId: scheduleInputs.teamBId,
      startDate: `${scheduleInputs.startDate}T${scheduleInputs.startTime}:00+08:00`,
      endDate: `${scheduleInputs.startDate}T${scheduleInputs.endTime}:00+08:00`,
      location: scheduleInputs.location ? scheduleInputs.location : undefined,
      createdById: userId,
    };

    add.mutate(data, {
      onSuccess: () => {
        setSelectedSport(null);
        setScheduleInputs(defaultInputs);
        setOpen(false);
      },
    });
  }

  const loading = sportsLoading || teamLoading || userLoading || add.isPending;
  const error = sportsError || teamSportsError || userError || add.error;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setSelectedSport(null);
          setScheduleInputs(defaultInputs);
        }
      }}
    >
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
          <div className="w-full grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate" className="font-bold opacity-50">
                Start Date
              </Label>
              <Input
                type="date"
                placeholder="Start Date"
                value={scheduleInputs.startDate}
                onChange={(e) =>
                  setScheduleInputs({
                    ...scheduleInputs,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startTime" className="font-bold opacity-50">
                Start Time
              </Label>
              <Input
                type="time"
                placeholder="Start Time"
                value={scheduleInputs.startTime}
                onChange={(e) =>
                  setScheduleInputs({
                    ...scheduleInputs,
                    startTime: e.target.value,
                  })
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
                value={scheduleInputs.endTime}
                onChange={(e) =>
                  setScheduleInputs({
                    ...scheduleInputs,
                    endTime: e.target.value,
                  })
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
              value={selectedSport?.toString() || ""}
              onValueChange={(value) =>
                setSelectedSport(value ? Number(value) : null)
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
                value={
                  scheduleInputs.teamAId !== -1
                    ? scheduleInputs.teamAId.toString()
                    : ""
                }
                onValueChange={(value) =>
                  setScheduleInputs({
                    ...scheduleInputs,
                    teamAId: value ? Number(value) : -1,
                  })
                }
                disabled={!selectedSport || loading}
                loading={teamLoading}
              />
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
                value={
                  scheduleInputs.teamBId !== -1
                    ? scheduleInputs.teamBId.toString()
                    : ""
                }
                onValueChange={(value) =>
                  setScheduleInputs({
                    ...scheduleInputs,
                    teamBId: value ? Number(value) : -1,
                  })
                }
                disabled={!selectedSport || loading}
                loading={teamLoading}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label htmlFor="location" className="font-bold opacity-50">
              Location
            </Label>
            <Input
              type="text"
              placeholder="Location"
              onChange={(e) =>
                setScheduleInputs({
                  ...scheduleInputs,
                  location: e.target.value,
                })
              }
            />
          </div>
        </div>
        <DialogFooter className="flex items-center">
          {error && <span className="text-red-500">{error.message}</span>}
          <Button
            type="submit"
            onClick={createSchedule}
            disabled={selectedSport === null || loading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
