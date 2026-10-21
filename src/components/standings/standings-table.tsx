"use client";

import {
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
} from "@/src/components/ui/table";
import standingColumns from "./columns";
import type { TeamStandingData } from "./transformTeamsData";
import { Trophy } from "lucide-react";
import { EmptyState } from "@/src/components/ui/empty-state";

type StandingsTableProps = {
  data: TeamStandingData[];
  sportName: string;
};

export default function StandingsTable({
  data,
  sportName,
}: StandingsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: standingColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="min-w-0 border border-neutral-300 bg-white bg-[url('/white-bg.png')] bg-top bg-repeat-y p-3 sm:p-5">
      <header className="mb-4 border-l-4 border-tc_primary pl-3">
        <h2 className="text-base font-bold uppercase text-neutral-950 sm:text-lg">
          {sportName || "Standings"}
        </h2>
      </header>

      <div className="min-w-0 border border-neutral-300">
        <Table className="table-fixed text-[10px] sm:min-w-160 sm:table-auto sm:text-sm">
          <colgroup>
            <col className="w-[8%] sm:w-auto" />
            <col className="w-[36%] sm:w-auto" />
            <col className="w-[15%] sm:w-auto" />
            <col className="w-[15%] sm:w-auto" />
            <col className="w-[8%] sm:w-auto" />
            <col className="w-[18%] sm:w-auto" />
          </colgroup>

          <TableHeader className="bg-neutral-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-neutral-300 hover:bg-neutral-200"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={
                      index === 1
                        ? "h-9 overflow-hidden px-1.5 text-left text-[9px] font-bold uppercase text-neutral-700 sm:h-10 sm:px-4 sm:text-[11px]"
                        : "h-9 overflow-hidden px-1 text-center text-[9px] font-bold uppercase text-neutral-700 sm:h-10 sm:px-3 sm:text-[11px]"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-neutral-300 odd:bg-white even:bg-neutral-100 hover:bg-neutral-200"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={
                        index === 1
                          ? "h-10 overflow-hidden px-1.5 text-left sm:h-12 sm:px-4"
                          : "h-10 overflow-hidden px-1 text-center font-medium sm:h-12 sm:px-3"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={standingColumns.length}
                  className="p-0 whitespace-normal"
                >
                  <EmptyState
                    icon={Trophy}
                    title="No completed games yet"
                    description="Standings will appear once match results are recorded."
                    className="rounded-none"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <footer className="mt-3 flex flex-col gap-2 text-[10px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
        <p className="italic">
          Records are calculated from completed tournament games.
        </p>

        <dl className="flex flex-wrap gap-x-3 gap-y-1">
          <div className="flex gap-1">
            <dt className="font-bold text-neutral-800">W:</dt>
            <dd>Wins</dd>
          </div>

          <div className="flex gap-1">
            <dt className="font-bold text-neutral-800">L:</dt>
            <dd>Losses</dd>
          </div>

          <div className="flex gap-1">
            <dt className="font-bold text-neutral-800">D:</dt>
            <dd>Draws</dd>
          </div>
        </dl>
      </footer>
    </section>
  );
}
