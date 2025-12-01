"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    AddChampionPayload,
    AddChampionSchema,
    EditChampionSchema,
} from "@/types/champions.types";
import { SearchableSelect } from "../schedules/searchable-select";
import { Team } from "@prisma/client";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import axios from "axios";

type FormMode = "add" | "edit";

type ChampionFormData =
    | z.infer<typeof AddChampionSchema>
    | (z.infer<typeof EditChampionSchema> & { id?: number });

type StandingFormDialogProps = {
    open: boolean;
    mode: FormMode;
    initialData?: ChampionFormData | null;
    selectedSport?: number;
    teams: Team[];
    onClose: () => void;
    onSubmit: (data: z.infer<typeof AddChampionSchema>) => void;
    onDelete?: () => void;
};

export default function StandingFormDialog({
    open,
    mode,
    initialData,
    selectedSport,
    teams,
    onClose,
    onSubmit,
    onDelete,
}: StandingFormDialogProps) {
    const today = new Date().toISOString().split("T")[0];
    const [scheduleInputs, setScheduleInputs] = useState<AddChampionPayload>({
        gameTypeId: selectedSport || 0,
        startDate: today,
        endDate: today,
        rank: 1,
        teamId: -1,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function createStanding() {
        try {
            setLoading(true);
            if (!selectedSport) return;

            const data: AddChampionPayload = {
                gameTypeId: selectedSport,
                teamId: scheduleInputs.teamId,
                startDate: new Date(scheduleInputs.startDate).toISOString(),
                endDate: new Date(scheduleInputs.endDate).toISOString(),
                rank: scheduleInputs.rank,
            };

            const newSchedule = await axios.post(`/api/champions`, data);
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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add Standing" : "Edit Standing"}
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="w-full flex flex-col gap-1 col-span-full">
                        <Label
                            htmlFor="teamId"
                            className="font-bold opacity-50"
                        >
                            Team ID
                        </Label>
                        <SearchableSelect
                            placeholder="Select Team"
                            searchPlaceholder="Search teams..."
                            emptyMessage="No teams found."
                            options={teams.map((team) => ({
                                value: team.id.toString(),
                                label: team.teamName,
                            }))}
                            value={scheduleInputs.teamId?.toString() || ""}
                            onChange={(value) =>
                                setScheduleInputs({
                                    ...scheduleInputs,
                                    teamId: Number(value),
                                })
                            }
                            disabled={teams.length <= 0}
                        />
                    </div>
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
                    <div className="w-full flex flex-col gap-1 col-span-full">
                        <Label
                            htmlFor="standing"
                            className="font-bold opacity-50"
                        >
                            Standing
                        </Label>
                        <Select
                            value={scheduleInputs.rank.toString()}
                            onValueChange={(value) =>
                                setScheduleInputs({
                                    ...scheduleInputs,
                                    rank: Number(value),
                                })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Standing" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Standing</SelectLabel>
                                    <SelectItem value="1">Champion</SelectItem>
                                    <SelectItem value="2">
                                        First Runner-Up
                                    </SelectItem>
                                    <SelectItem value="3">
                                        Second Runner-Up
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    {mode === "edit" && onDelete && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={onDelete}
                            className="mr-auto"
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={createStanding}>
                        {mode === "add" ? "Add Standing" : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
