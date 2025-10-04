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
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

interface StandingsTableSkeletonProps {
    rows?: number;
}

export default function StandingsTableSkeleton({
    rows = 8,
}: StandingsTableSkeletonProps) {
    return (
        <div className={`border overflow-x-auto ${roboto.className}`}>
            <Table
                className="w-full border-collapse text-sm [&_th]:!border-0 [&_td]:!border-0 [&_tr]:!border-0 [&_thead]:!border-0 [&_tbody]:!border-0"
                style={{ borderCollapse: "collapse" }}
            >
                <TableHeader
                    className="bg-[#FAFAFA] text-[#080808] [&_tr]:!border-0 [&_th]:!border-0"
                    style={{ border: "none" }}
                >
                    <TableRow
                        className="h-[60px] !border-0"
                        style={{ border: "none" }}
                    >
                        <TableHead
                            className="h-[60px] px-4 font-bold uppercase w-[942px] text-left !border-0"
                            style={{ border: "none" }}
                        >
                            TEAM
                        </TableHead>
                        <TableHead
                            className="h-[60px] px-4 font-bold uppercase w-[142px] text-center !border-0"
                            style={{ border: "none" }}
                        >
                            W
                        </TableHead>
                        <TableHead
                            className="h-[60px] px-4 font-bold uppercase w-[142px] text-center !border-0"
                            style={{ border: "none" }}
                        >
                            L
                        </TableHead>
                        <TableHead
                            className="h-[60px] px-4 font-bold uppercase w-[142px] text-center !border-0"
                            style={{ border: "none" }}
                        >
                            WIN %
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody
                    className="text-[#3A3A3A] [&_tr]:!border-0 [&_td]:!border-0"
                    style={{ border: "none" }}
                >
                    {Array.from({ length: rows }).map((_, index) => (
                        <TableRow
                            key={index}
                            className="h-[60px] !border-0"
                            style={{ border: "none" }}
                        >
                            {/* Team column */}
                            <TableCell
                                className="h-[60px] px-4 w-[942px] text-left !border-0"
                                style={{ border: "none" }}
                            >
                                <div className="flex items-center gap-2">
                                    <Skeleton className="size-6 rounded" />
                                    <Skeleton className="h-4 w-[120px]" />
                                </div>
                            </TableCell>

                            {/* Wins column */}
                            <TableCell
                                className="h-[60px] px-4 w-[142px] text-center !border-0"
                                style={{ border: "none" }}
                            >
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-[30px]" />
                                </div>
                            </TableCell>

                            {/* Losses column */}
                            <TableCell
                                className="h-[60px] px-4 w-[142px] text-center !border-0"
                                style={{ border: "none" }}
                            >
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-[30px]" />
                                </div>
                            </TableCell>

                            {/* Win % column */}
                            <TableCell
                                className="h-[60px] px-4 w-[142px] text-center !border-0"
                                style={{ border: "none" }}
                            >
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-[40px]" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
