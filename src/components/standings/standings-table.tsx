"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
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

type TeamStanding = {
    team: string;
    wins: number;
    losses: number;
    winPct: string;
};

interface DataTableProps {
    columns: ColumnDef<TeamStanding>[];
    data: TeamStanding[];
}

export default function DataTable({ columns, data }: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

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
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="h-[60px] !border-0"
                            style={{ border: "none" }}
                        >
                            {headerGroup.headers.map((header, i) => (
                                <TableHead
                                    key={header.id}
                                    className={`h-[60px] px-4 font-bold uppercase ${
                                        i === 0
                                            ? "w-[942px] text-left"
                                            : "w-[142px] text-center"
                                    } !border-0`}
                                    style={{ border: "none" }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody
                    className="text-[#3A3A3A] [&_tr]:!border-0 [&_td]:!border-0"
                    style={{ border: "none" }}
                >
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="h-[60px] !border-0"
                                style={{ border: "none" }}
                            >
                                {row.getVisibleCells().map((cell, i) => (
                                    <TableCell
                                        key={cell.id}
                                        className={`h-[60px] px-4 ${
                                            i === 0
                                                ? "w-[942px] text-left"
                                                : "w-[142px] text-center"
                                        } !border-0`}
                                        style={{ border: "none" }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow
                            className="h-[60px] !border-0"
                            style={{ border: "none" }}
                        >
                            <TableCell
                                colSpan={columns.length}
                                className="h-[60px] text-center !border-0"
                                style={{ border: "none" }}
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
