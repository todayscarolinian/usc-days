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
import { Scores } from "@/types/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { EditScorePayload } from "@/types/scores.types";
import axios from "axios";

interface ScoreInputs {
    teamA: {
        teamId: number;
        score: number;
    };
    teamB: {
        teamId: number;
        score: number;
    };
}

export default function EditScoreDialog({ game }: { game: Scores }) {
    const [scoreInputs, setScoreInputs] = useState<ScoreInputs>({
        teamA: { teamId: game.teamA.id, score: game.score.teamAScore },
        teamB: { teamId: game.teamB.id, score: game.score.teamBScore },
    });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function editScore() {
        setLoading(true);
        setError("");
        if (!game) return;

        const data: EditScorePayload = {
            gameId: game.id,
            teamAScore: Number(scoreInputs.teamA.score),
            teamBScore: Number(scoreInputs.teamB.score),
        };

        try {
            const newScore = await axios.put(`/api/scores`, data);

            console.log(newScore);

            setLoading(false);
            if (newScore.status != 200) {
                setError("An error occurred");
                console.log(newScore.data.error);
            } else {
                const revalidation = await axios.get(`/api/revalidate`, {
                    params: {
                        path: "/",
                    },
                });

                console.log(revalidation);
                setError("");
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error);
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="text-primary-foreground bg-[#9B2626] hover:bg-[#771D1D] h-9 rounded-md px-3">
                <FaRegEdit />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Score</DialogTitle>
                    <DialogDescription>
                        Edit an existing score. Click Submit when you&apos;re
                        done or Remove to delete the entry.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-8 py-4">
                    <div className="relative flex flex-col gap-4 p-4 border-2 rounded-md md:flex-row sm:gap-10">
                        <p className="absolute top-[-12px] bg-[#f9f9f9] text-[#2D2A29]">
                            Set {game.teamA.teamName} Score
                        </p>
                        <div className="w-56 md:w-64">
                            <Input
                                type="number"
                                name="teamAScore"
                                value={scoreInputs.teamA.score}
                                onChange={(e) =>
                                    setScoreInputs((prev) => ({
                                        ...prev,
                                        teamA: {
                                            ...prev.teamA,
                                            score: Number(e.target.value),
                                        },
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-4 p-4 border-2 rounded-md md:flex-row sm:gap-10">
                        <p className="absolute top-[-12px] bg-[#f9f9f9] text-[#2D2A29]">
                            Set {game.teamB.teamName} Score
                        </p>
                        <div className="w-56 md:w-64">
                            <Input
                                type="number"
                                name="teamBScore"
                                value={scoreInputs.teamB.score}
                                onChange={(e) =>
                                    setScoreInputs((prev) => ({
                                        ...prev,
                                        teamB: {
                                            ...prev.teamB,
                                            score: Number(e.target.value),
                                        },
                                    }))
                                }
                            />
                        </div>
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
                                    permanently delete the score entry and
                                    remove the data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button
                        type="submit"
                        className="px-8"
                        onClick={editScore}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
