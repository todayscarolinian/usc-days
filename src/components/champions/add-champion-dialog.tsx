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

import { getSportsTeamData } from "@/lib/actions";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AddChampionPayload } from "@/types/champions.types";

interface ChampionInputs {
    gameTypeId: number;
    teamId: [number, number, number];
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
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

export default function AddChampionDialog() {
    const [selectedSport, setSelectedSport] = useState<number | null>(null);
    const [sports, setSports] = useState<Sport[]>([]);
    const [sportTeams, setSportTeams] = useState<SportTeam[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingTeams, setFetchingTeams] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [championInputs, setChampionInputs] = useState<ChampionInputs>({
        gameTypeId: -1,
        teamId: [-1, -1, -1],
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
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

        fetchSportTeamsData();
    }, [selectedSport]);

    async function createChampion() {
        setLoading(true);
        try {
            if (!selectedSport) return;

            championInputs.teamId.map(async (teamId, index) => {
                const data: AddChampionPayload = {
                    gameTypeId: selectedSport,
                    teamId: teamId,
                    startDate: `${championInputs.startDate}T${championInputs.startTime}:00+08:00`,
                    endDate: `${championInputs.endDate}T${championInputs.endTime}:00+08:00`,
                    rank: index + 1,
                };

                const newChampion = await axios.post(`/api/champions`, data);
                if (newChampion.status != 201) {
                    setError("An error occurred");
                    console.log(newChampion.data.error);
                    setLoading(false);
                    return;
                }
            });

            setLoading(false);
            window.location.reload();
        } catch (error) {
            setLoading(false);
            setError("An error occurred.");
            console.log(error);
        }
    }

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                setSelectedSport(null);
                setChampionInputs({
                    gameTypeId: -1,
                    teamId: [-1, -1, -1],
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                });
            }
        }}>
            <DialogTrigger asChild>
                <Button className="bg-tc_primary-500 hover:bg-tc_primary-600">
                    Add Champion
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Champion</DialogTitle>
                    <DialogDescription>
                        Add a new champion of a game. Click Submit when
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
                                onChange={(e) =>
                                    setChampionInputs({
                                        ...championInputs,
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
                                    setChampionInputs({
                                        ...championInputs,
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
                                    setChampionInputs({
                                        ...championInputs,
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
                                    setChampionInputs({
                                        ...championInputs,
                                        endTime: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <Select
                            onValueChange={(value) =>
                                setSelectedSport(Number(value))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Game" />
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
                    <div className="flex flex-col gap-4 p-4 border-2 rounded-md relative">
                        <p className="absolute top-[-10px] bg-[#f9f9f9] text-[#2D2A29] text-sm">
                            Add Winners
                        </p>
                        <Select
                            onValueChange={(value) =>
                                setChampionInputs({
                                    ...championInputs,
                                    teamId: [
                                        Number(value),
                                        championInputs.teamId[1],
                                        championInputs.teamId[2],
                                    ],
                                })
                            }
                            disabled={!selectedSport || fetchingTeams}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Champion" />
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
                        <Select
                            onValueChange={(value) =>
                                setChampionInputs({
                                    ...championInputs,
                                    teamId: [
                                        championInputs.teamId[0],
                                        Number(value),
                                        championInputs.teamId[2],
                                    ],
                                })
                            }
                            disabled={!selectedSport || fetchingTeams}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select First Runner Up" />
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
                        <Select
                            onValueChange={(value) =>
                                setChampionInputs({
                                    ...championInputs,
                                    teamId: [
                                        championInputs.teamId[0],
                                        championInputs.teamId[1],
                                        Number(value),
                                    ],
                                })
                            }
                            disabled={!selectedSport || fetchingTeams}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Second Runner Up" />
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
                <DialogFooter>
                    {error && <span className="text-red-500">{error}</span>}
                    <Button
                        type="submit"
                        onClick={async () => {
                            await createChampion();
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
