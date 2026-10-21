import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { StandingData } from "@/src/types/types";
import { getLogoForSchool } from "@/src/lib/utils";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: {
    className?: string;
  };
};

export const columns: ColumnDef<StandingData>[] = [
  {
    accessorKey: "team",
    header: "TEAM",
    meta: { className: "w-100" },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={getLogoForSchool(row.getValue("team")).src}
          alt="Sport Logo"
          className="size-6"
          width={24}
          height={24}
        />
        <span>{row.getValue("team")}</span>
      </div>
    ),
  },
  {
    accessorKey: "wins",
    sortDescFirst: true,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() !== "desc")}
        >
          W
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: { className: "w-16 text-center" },
  },
  {
    accessorKey: "losses",
    header: "L",
    meta: { className: "w-16 text-center" },
  },
  {
    accessorKey: "draws",
    header: "D",
    meta: { className: "w-16 text-center" },
  },
  {
    accessorKey: "winPercentage",
    header: "WIN %",
    meta: { className: "w-20 text-center" },
    cell: ({ row }) => {
      const value = row.getValue<number>("winPercentage");
      return `${value.toFixed(2)}%`;
    },
  },
];

/** Multi-team 1st/2nd/3rd counts; shown only when some row has a placing. */
const placingColumns: ColumnDef<StandingData>[] = [
  { accessorKey: "firsts", header: "1ST", meta: { className: "w-16 text-center" } },
  { accessorKey: "seconds", header: "2ND", meta: { className: "w-16 text-center" } },
  { accessorKey: "thirds", header: "3RD", meta: { className: "w-16 text-center" } },
];

/** Leaderboard columns, with placings before Win % when any row has them. */
export function getLeaderboardColumns(showPlacings: boolean): ColumnDef<StandingData>[] {
  if (!showPlacings) return columns;
  return [...columns.slice(0, -1), ...placingColumns, ...columns.slice(-1)];
}
