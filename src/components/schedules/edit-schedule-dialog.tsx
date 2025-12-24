"use client";

import { useState } from "react";
import {
    useEditGamesQuery,
    useDeleteGamesQuery,
} from "@/queries/games.queries";
import { getGameTypesQuery } from "@/queries/gametypes.queries";
import { getTeamGameTypesQuery } from "@/queries/teamgametypes.queries";
import { FaRegEdit } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { EditGamePayload, DeleteGamePayload } from "@/types/games.types";
import { Schedules } from "@/types/types";
import { getSportsTeamData } from "@/lib/actions";
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
    const [selectedSport, setSelectedSport] = useState<number>(
        schedule.gameType.id
    );
    const [sports, setSports] = useState<Sport[]>([]);
    const [sportTeams, setSportTeams] = useState<SportTeam[]>([]);
    const [fetchingTeams, setFetchingTeams] = useState<boolean>(false);
    const [scheduleInputs, setScheduleInputs] = useState<ScheduleInputs>({
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
    });

    const sportsOptions: SelectOption[] = sports.map((sport) => ({
        value: sport.id.toString(),
        label: sport.gameName,
        id: sport.id,
    }));

    const teamOptions: SelectOption[] = sportTeams.map((team) => ({
        value: team.teamId.toString(),
        label: team.team.teamName,
        id: team.teamId,
    }));

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
            location: scheduleInputs.location
                ? scheduleInputs.location
                : undefined,
            teamAScore: schedule.teamAScore ?? 0,
            teamBScore: schedule.teamBScore ?? 0,
        };

        edit.mutate(data, {
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    const del = useDeleteGamesQuery();
    const deleteSchedule = () => {
        del.mutate(
            { scheduleId: schedule.id },
            {
                onSuccess: () => {
                    window.location.reload();
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
                    setSportTeams([]);
                    setScheduleInputs({
                        teamAId: schedule.teamA.id,
                        teamBId: schedule.teamB.id,
                        startDate: new Date(
                            schedule.startDate
                        ).toLocaleDateString("en-CA", {
                            timeZone: "Asia/Manila",
                        }),
                        endDate: new Date(schedule.endDate).toLocaleDateString(
                            "en-CA",
                            {
                                timeZone: "Asia/Manila",
                            }
                        ),
                        startTime: new Date(
                            schedule.startDate
                        ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "Asia/Manila",
                        }),
                        endTime: new Date(schedule.endDate).toLocaleTimeString(
                            "en-US",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Manila",
                            }
                        ),
                        location: schedule.location
                            ? schedule.location
                            : undefined,
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
                        Edit an existing game schedule. Click Save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-8 py-4">
                    <div className="grid w-full grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label
                                htmlFor="startDate"
                                className="font-bold opacity-50"
                            >
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
                            <Label
                                htmlFor="endDate"
                                className="font-bold opacity-50"
                            >
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
                            <Label
                                htmlFor="startTime"
                                className="font-bold opacity-50"
                            >
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
                            <Label
                                htmlFor="endTime"
                                className="font-bold opacity-50"
                            >
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
                            onChange={(value) =>
                                setSelectedSport(Number(value))
                            }
                            disabled={sports.length <= 0 || loading}
                            width="w-fit"
                        />
                    </div>

                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex w-full flex-col gap-1">
                            <Label
                                htmlFor="teamA"
                                className="font-bold opacity-50"
                            >
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
                                disabled={
                                    sportTeams.length <= 0 || fetchingTeams
                                }
                            />
                        </div>

                        <span className="font-bold opacity-50">vs</span>

                        <div className="flex w-full flex-col gap-1">
                            <Label
                                htmlFor="teamB"
                                className="font-bold opacity-50"
                            >
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
                                disabled={
                                    sportTeams.length <= 0 || fetchingTeams
                                }
                            />
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <Label
                            htmlFor="location"
                            className="font-bold opacity-50"
                        >
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
                    {error && (
                        <span className="text-red-500">{error?.message}</span>
                    )}

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
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the schedule entry and
                                    remove the data from our servers.
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
                            loading ||
                            sportTeams.length <= 0 ||
                            sports.length <= 0
                        }
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
