"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface StandingsTableSkeletonProps {
    rows?: number;
    title?: string;
    error?: string | null;
}

export default function LeaderboardsTableSkeleton({
    rows = 8,
    title = "USC DAYS",
    error = null,
}: StandingsTableSkeletonProps) {
    return (
        <div className="rounded-md border">
            <div className="p-6 bg-black flex gap-4 justify-between items-center">
                <h1 className="uppercase text-white text-2xl font-bold">
                    {title}
                </h1>
            </div>
            <Table>
                <TableHeader className="bg-gray text-white">
                    <TableRow className="border-none">
                        <TableHead className="p-4 md:p-6 w-[942px] font-bold bg-gray-50">
                            TEAM
                        </TableHead>
                        <TableHead className="p-4 md:p-6 w-[142px] font-bold bg-gray-50">
                            W
                        </TableHead>
                        <TableHead className="p-4 md:p-6 w-[142px] font-bold bg-gray-50">
                            L
                        </TableHead>
                        <TableHead className="p-4 md:p-6 w-[142px] font-bold bg-gray-50">
                            WIN %
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody
                    className="text-[#3A3A3A] [&_tr]:!border-0 [&_td]:!border-0"
                    style={{ border: "none" }}
                >
                    {error ? (
                        <TableRow className="h-[60px] !border-0">
                            <TableCell
                                colSpan={4}
                                className="text-center text-red-500"
                            >
                                {error}
                            </TableCell>
                        </TableRow>
                    ) : (
                        Array.from({ length: rows }).map((_, index) => (
                            <TableRow
                                key={index}
                                className="h-[60px] !border-0"
                                style={{ border: "none" }}
                            >
                                {/* Team column */}
                                <TableCell
                                    className="h-[60px] px-4 text-left !border-0"
                                    style={{ border: "none" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-6 rounded" />
                                        <Skeleton className="h-4 w-[120px]" />
                                    </div>
                                </TableCell>

                                {/* Wins column */}
                                <TableCell
                                    className="h-[60px] px-4 text-center !border-0"
                                    style={{ border: "none" }}
                                >
                                    <div className="flex justify-center">
                                        <Skeleton className="h-4 w-[30px]" />
                                    </div>
                                </TableCell>

                                {/* Losses column */}
                                <TableCell
                                    className="h-[60px] px-4 text-center !border-0"
                                    style={{ border: "none" }}
                                >
                                    <div className="flex justify-center">
                                        <Skeleton className="h-4 w-[30px]" />
                                    </div>
                                </TableCell>

                                {/* Win % column */}
                                <TableCell
                                    className="h-[60px] px-4 text-center !border-0"
                                    style={{ border: "none" }}
                                >
                                    <div className="flex justify-center">
                                        <Skeleton className="h-4 w-[40px]" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
