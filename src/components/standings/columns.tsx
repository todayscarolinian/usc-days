"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { getLogoForSchool } from "@/src/lib/utils";
import type { TeamStandingData } from "./transformTeamsData";

const standingColumns: ColumnDef<TeamStandingData>[] = [
  {
    id: "position",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const team = row.original.team;
      const logo = getLogoForSchool(team);

      return (
        <div className="flex min-w-0 items-center gap-1.5 sm:min-w-44 sm:gap-3">
          <Image
            src={logo}
            alt={`${team} logo`}
            className="size-5 shrink-0 object-contain sm:size-7"
          />

          <span className="min-w-0 truncate font-semibold text-neutral-900">
            {team}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "played",
    header: "Played",
    cell: ({ row }) => row.original.played,
  },
  {
    id: "record",
    header: "W / L",
    cell: ({ row }) =>
      `${row.original.wins} / ${row.original.losses}`,
  },
  {
    accessorKey: "draws",
    header: "D",
    cell: ({ row }) => row.original.draws,
  },
  {
    accessorKey: "winPercentage",
    header: "Win %",
    cell: ({ row }) => `${row.original.winPercentage.toFixed(2)}%`,
  },
];

/** Multi-team 1st/2nd/3rd counts; shown only when some row has a placing. */
export const placingsColumn: ColumnDef<TeamStandingData> = {
  id: "placings",
  header: () => <span title="1st / 2nd / 3rd places">1st / 2nd / 3rd</span>,
  cell: ({ row }) =>
    `${row.original.firsts} / ${row.original.seconds} / ${row.original.thirds}`,
};

/** Standings columns, with placings before Win % when any row has them. */
export function getStandingColumns(showPlacings: boolean): ColumnDef<TeamStandingData>[] {
  if (!showPlacings) return standingColumns;
  return [...standingColumns.slice(0, -1), placingsColumn, ...standingColumns.slice(-1)];
}

export default standingColumns;
