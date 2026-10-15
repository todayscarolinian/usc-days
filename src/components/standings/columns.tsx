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

export default standingColumns;
