"use client";

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { DeleteGamePayload, EditGamePayload } from "@/types/games.types";
import { Label } from "@/components/ui/label";
import { Schedules } from "@/types/types";
import { FaRegEdit } from "react-icons/fa";
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
import { prisma } from "@/lib/prisma";

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
}: {
    schedule: Schedules;
}) {
    const [selectedSport, setSelectedSport] = useState<number>(
        schedule.gameType.id
    );
    const [sports, setSports] = useState<Sport[]>([]);
    const [sportTeams, setSportTeams] = useState<SportTeam[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingTeams, setFetchingTeams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
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
            hour12: false, // Use 24-hour format
            timeZone: "Asia/Manila",
        }),
        endTime: new Date(schedule.endDate).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Use 24-hour format
            timeZone: "Asia/Manila",
        }),
        location: schedule.location ? schedule.location : undefined,
    });

    useEffect(() => {
        const fetchSportsData = async () => {
            try {
                const {
                    data: { sports: fetchedSportsData },
                } = await axios.get("/api/sports");

                setSports(fetchedSportsData);
            } catch (err) {
                console.error("Error fetching sports data:", err);
                setError("Failed to load sports data");

                fetchSportsData();
            }
        };

        fetchSportsData();
    }, []);

    useEffect(() => {
        const fetchSportTeamsData = async () => {
            try {
                setFetchingTeams(true);
                const fetchedSportTeamData = await prisma.teamGameType.findMany({
                    where: {
                        gameTypeId: Number(selectedSport),
                    },
                    include: {
                        team: {
                            select: {
                                teamName: true,
                            },
                        },
                    },
                });

                setFetchingTeams(false);
                setSportTeams(fetchedSportTeamData);
            } catch (err) {
                console.error("Error fetching sports data:", err);
                setError("Failed to load sports data");
            }
        };

        fetchSportTeamsData();
    }, [selectedSport]);

    async function editSchedule() {
        try {
            setLoading(true);
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
            };

            const newSchedule = await axios.put(`/api/games`, data);

            setLoading(false);
            if (newSchedule.status != 200) {
                setError("An error occurred");
                console.log(newSchedule.data.error);
            } else window.location.reload();
        } catch (error) {
            setLoading(false);
            setError("An error occurred.");
            console.log(error);
        }
    }

    async function deleteSchedule() {
        setLoading(true);
        setError("");
        if (!selectedSport) return;

        const data: DeleteGamePayload = {
            id: schedule.id,
        };

        try {
            const deletedScore = await axios.delete(`/api/games`, { data });

            setLoading(false);
            if (deletedScore.status != 200) {
                setError("An error occurred");
                console.log(deletedScore.data.error);
            } else window.location.reload();
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error);
            }
        }
    }

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
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
                            hour12: false, // Use 24-hour format
                            timeZone: "Asia/Manila",
                        }),
                        endTime: new Date(schedule.endDate).toLocaleTimeString(
                            "en-US",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false, // Use 24-hour format
                                timeZone: "Asia/Manila",
                            }
                        ),
                        location: schedule.location
                            ? schedule.location
                            : undefined,
                    });
                }
            }}
        >
            <DialogTrigger className="text-primary-foreground bg-[#9B2626] hover:bg-[#771D1D] h-9 rounded-md px-3">
                <FaRegEdit />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Score</DialogTitle>
                    <DialogDescription>
                        Edit an existing game schedule. Click Submit when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                    <div className="w-full grid grid-cols-2 gap-4">
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
                                value={scheduleInputs.startDate}
                                onChange={(e) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        startDate: e.target.value,
                                    })
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
                                value={scheduleInputs.endDate}
                                onChange={(e) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        endDate: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4">
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
                            <Label
                                htmlFor="endTime"
                                className="font-bold opacity-50"
                            >
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
                        <Select
                            value={
                                sports.length > 0
                                    ? selectedSport.toString()
                                    : undefined
                            }
                            onValueChange={(value: string) =>
                                setSelectedSport(Number(value))
                            }
                            disabled={sports.length <= 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Loading..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {sports.map((sport) => (
                                        <SelectItem
                                            key={sport.id}
                                            value={sport.id.toString()}
                                        >
                                            {sport.gameName}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1 w-full">
                            <Label
                                htmlFor="teamA"
                                className="font-bold opacity-50"
                            >
                                Team
                            </Label>
                            <Select
                                value={
                                    sportTeams.length > 0
                                        ? scheduleInputs.teamAId.toString()
                                        : undefined
                                }
                                onValueChange={(value: string) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        teamAId: Number(value),
                                    })
                                }
                                disabled={sportTeams.length <= 0 || fetchingTeams}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Loading..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {sportTeams.map((team) => (
                                            <SelectItem
                                                key={team.id}
                                                value={team.teamId.toString()}
                                            >
                                                {team.team.teamName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="font-bold opacity-50">vs</span>
                        <div className="flex flex-col gap-1 w-full">
                            <Label
                                htmlFor="teamB"
                                className="font-bold opacity-50"
                            >
                                Team
                            </Label>
                            <Select
                                value={
                                    sportTeams.length > 0
                                        ? scheduleInputs.teamBId.toString()
                                        : undefined
                                }
                                onValueChange={(value: string) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        teamBId: Number(value),
                                    })
                                }
                                disabled={sportTeams.length <= 0 || fetchingTeams}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Loading..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {sportTeams.map((team) => (
                                            <SelectItem
                                                key={team.id}
                                                value={team.teamId.toString()}
                                            >
                                                {team.team.teamName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <Label
                            htmlFor="location"
                            className="font-bold opacity-50"
                        >
                            Location
                        </Label>
                        <Input
                            type="text"
                            placeholder="Location"
                            value={scheduleInputs.location}
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
                    {error && <span className="text-red-500">{error}</span>}
                    <AlertDialog>
                        <AlertDialogTrigger disabled={loading}>
                            <Button
                                className="bg-transparent border border-tc_primary text-tc_primary hover:text-white"
                                type="button"
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
                                <AlertDialogAction
                                onClick={deleteSchedule}
                                >
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
