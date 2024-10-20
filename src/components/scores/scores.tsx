"use client";

import { useEffect, useState } from "react";
import { scoreColumns } from "@/components/scores/columns";
import { DataTable } from "@/components/scores/score-table";
import AddScoreDialog from "@/components/scores/add-score-dialog";
import { Schedules, Scores } from "@/types/types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AdvancedSearch } from "./advanced-search";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ScoresPage() {
    const [gamesData, setGamesData] = useState<Scores[]>([]);
    const [schedulesData, setSchedulesData] = useState<Schedules[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { games: data },
                } = await axios.get(`/api/games`);

                const now = new Date();

                // Filter games data
                const filteredGamesData = data
                    .filter((game: Scores) => game.score !== null)
                    .sort(
                        (a: Scores, b: Scores) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime()
                    );
                const filteredSchedulesData = data
                    .filter((game: Scores) => {
                        const startDate = new Date(game.startDate);
                        const isFuture =
                            now.getTime() - startDate.getTime() <= 0;
                        return !isFuture && game.score === null; // games that are not yet ongoing and don't have a score
                    })
                    .sort(
                        (a: Scores, b: Scores) =>
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime()
                    );

                setGamesData(filteredGamesData);
                setSchedulesData(filteredSchedulesData);
            } catch (err) {
                console.error("Error fetching scores data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:py-10">
                <div className="mx-auto sm:max-w-[90rem]">
                    <div className="rounded-md border">
                        <div className="p-6 bg-black flex gap-4 justify-between items-center">
                            <h1 className="uppercase text-white text-3xl font-bold">
                                USC Days
                            </h1>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Keyword Search"
                                    className="max-w-sm"
                                />
                                <AdvancedSearch />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none">
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Date
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Sport
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Teams
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Score
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Winner
                                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:py-10">
                <div className="mx-auto sm:max-w-[90rem]">
                    <div className="rounded-md border">
                        <div className="p-6 bg-black flex gap-4 justify-between items-center">
                            <h1 className="uppercase text-white text-3xl font-bold">
                                USC Days
                            </h1>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Keyword Search"
                                    className="max-w-sm"
                                />
                                <AdvancedSearch />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none">
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Date
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Sport
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Teams
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Score
                                        </span>
                                    </TableHead>
                                    <TableHead className={`p-4 md:p-6`}>
                                        <span className="font-bold sm:text-lg">
                                            Winner
                                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <div className="p-4">
                            <p className="text-red-500">Failed to load data</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:py-10">
            <div className="mx-auto sm:max-w-[90rem]">
                <DataTable
                    columns={scoreColumns}
                    data={gamesData}
                    actionButton={<AddScoreDialog schedules={schedulesData} />}
                />
            </div>
        </div>
    );
}
