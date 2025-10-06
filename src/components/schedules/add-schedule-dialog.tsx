"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

import { AddGamePayload } from "@/types/games.types";
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

export default function AddScheduleDialog() {
    const [selectedSport, setSelectedSport] = useState<number | null>(null);
    const [sports, setSports] = useState<Sport[]>([]);
    const [sportTeams, setSportTeams] = useState<SportTeam[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingTeams, setFetchingTeams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [scheduleInputs, setScheduleInputs] = useState<ScheduleInputs>({
        teamAId: -1,
        teamBId: -1,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        location: undefined,
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
            }
        };

        fetchSportsData();
    }, []);

    useEffect(() => {
        const fetchSportTeamsData = async () => {
            try {
                setFetchingTeams(true);
                const fetchedSportTeamData = await getSportsTeamData(
                    Number(selectedSport)
                );
                if (!fetchedSportTeamData)
                    return setError("Failed to load sports data");
                setFetchingTeams(false);
                setSportTeams(fetchedSportTeamData);
            } catch (err) {
                console.error("Error fetching sports data:", err);
                setError("Failed to load sports data");
            }
        };

        if (selectedSport) fetchSportTeamsData();
    }, [selectedSport]);

    async function createSchedule() {
        try {
            setLoading(true);
            if (!selectedSport) return;

            const data: AddGamePayload = {
                gameTypeId: selectedSport,
                teamAId: scheduleInputs.teamAId,
                teamBId: scheduleInputs.teamBId,
                startDate: `${scheduleInputs.startDate}T${scheduleInputs.startTime}:00+08:00`,
                endDate: `${scheduleInputs.endDate}T${scheduleInputs.endTime}:00+08:00`,
                location: scheduleInputs.location
                    ? scheduleInputs.location
                    : undefined,
                createdById: 1, // mock user ID for now
            };

            const newSchedule = await axios.post(`/api/games`, data);
            setLoading(false);

            if (newSchedule.status !== 201) {
                setError("An error occurred");
                console.log(newSchedule.data.error);
            } else {
                window.location.reload();
            }
        } catch (error) {
            setLoading(false);
            setError("An error occurred.");
            console.log(error);
        }
    }

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) {
                    setSelectedSport(null);
                    setSportTeams([]);
                    setScheduleInputs({
                        teamAId: -1,
                        teamBId: -1,
                        startDate: "",
                        endDate: "",
                        startTime: "",
                        endTime: "",
                        location: undefined,
                    });
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-tc_primary-500 hover:bg-tc_primary-600">
                    Add Schedule
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Schedule</DialogTitle>
                    <DialogDescription>
                        Add a new game schedule. Click Submit when you&apos;re
                        done.
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
                            onChange={(value) =>
                                setSelectedSport(value ? Number(value) : null)
                            }
                            disabled={loading}
                            width="w-fit"
                        />
                    </div>
                    <div className="w-full flex justify-between items-center gap-4">
                        <div className="flex flex-col gap-1 w-full">
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
                                value={
                                    scheduleInputs.teamAId !== -1
                                        ? scheduleInputs.teamAId.toString()
                                        : ""
                                }
                                onChange={(value) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        teamAId: value ? Number(value) : -1,
                                    })
                                }
                                disabled={!selectedSport || fetchingTeams}
                            />
                        </div>
                        <span className="font-bold opacity-50">vs</span>
                        <div className="flex flex-col gap-1 w-full">
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
                                value={
                                    scheduleInputs.teamBId !== -1
                                        ? scheduleInputs.teamBId.toString()
                                        : ""
                                }
                                onChange={(value) =>
                                    setScheduleInputs({
                                        ...scheduleInputs,
                                        teamBId: value ? Number(value) : -1,
                                    })
                                }
                                disabled={!selectedSport || fetchingTeams}
                            />
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
                    <Button
                        type="submit"
                        onClick={async () => {
                            await createSchedule();
                        }}
                        disabled={selectedSport === null || loading}
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
