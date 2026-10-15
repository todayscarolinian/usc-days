"use client";

import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

type StandingsTableSkeletonProps = {
  rows?: number;
};

const headers = ["#", "Team", "Played", "W / L", "D", "Win %"];

export default function StandingsTableSkeleton({
  rows = 8,
}: StandingsTableSkeletonProps) {
  return (
    <section className="min-w-0 border border-neutral-300 bg-white bg-[url('/white-bg.png')] bg-top bg-repeat-y p-3 sm:p-5">
      <header className="mb-4 border-l-4 border-tc_primary pl-3">
        <Skeleton className="h-6 w-48 max-w-full" />
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
            <TableRow className="border-neutral-300">
              {headers.map((header, index) => (
                <TableHead
                  key={header}
                  className={
                    index === 1
                      ? "h-9 overflow-hidden px-1.5 text-left text-[9px] font-bold uppercase text-neutral-700 sm:h-10 sm:px-4 sm:text-[11px]"
                      : "h-9 overflow-hidden px-1 text-center text-[9px] font-bold uppercase text-neutral-700 sm:h-10 sm:px-3 sm:text-[11px]"
                  }
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: rows }, (_, index) => (
              <TableRow
                key={index}
                className="border-neutral-300 odd:bg-white even:bg-neutral-100"
              >
                <TableCell className="h-10 px-1 text-center sm:h-12 sm:px-3">
                  <Skeleton className="mx-auto h-3 w-3" />
                </TableCell>

                <TableCell className="h-10 overflow-hidden px-1.5 sm:h-12 sm:px-4">
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
                    <Skeleton className="size-5 shrink-0 rounded-full sm:size-7" />
                    <Skeleton className="h-3 min-w-0 flex-1 sm:h-4" />
                  </div>
                </TableCell>

                <TableCell className="h-10 px-1 text-center sm:h-12 sm:px-3">
                  <Skeleton className="mx-auto h-3 w-4" />
                </TableCell>

                <TableCell className="h-10 px-1 text-center sm:h-12 sm:px-3">
                  <Skeleton className="mx-auto h-3 w-7" />
                </TableCell>

                <TableCell className="h-10 px-1 text-center sm:h-12 sm:px-3">
                  <Skeleton className="mx-auto h-3 w-3" />
                </TableCell>

                <TableCell className="h-10 px-1 text-center sm:h-12 sm:px-3">
                  <Skeleton className="mx-auto h-3 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Skeleton className="mt-3 h-3 w-56 max-w-full" />
    </section>
  );
}