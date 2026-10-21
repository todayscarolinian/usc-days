"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { getLogoForSchool } from "@/src/lib/utils";
import { formatPlacement } from "@/src/lib/multi-team";
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

/** One entry's finish in a multi-team sport, e.g. "1st", "4th", or "DNF". */
const placementColumn: ColumnDef<TeamStandingData> = {
  id: "placement",
  header: "Placement",
  cell: ({ row }) => formatPlacement(row.original.placement),
};

/** 1st/2nd/3rd counts across several games, as on the overall leaderboard. */
const placingsColumn: ColumnDef<TeamStandingData> = {
  id: "placings",
  header: () => <span title="1st / 2nd / 3rd places">1st / 2nd / 3rd</span>,
  cell: ({ row }) =>
    `${row.original.firsts} / ${row.original.seconds} / ${row.original.thirds}`,
};

export type MultiTeamColumn = "placement" | "placings" | null;

/** Standings columns, with the multi-team column (if any) before Win %. */
export function getStandingColumns(extra: MultiTeamColumn): ColumnDef<TeamStandingData>[] {
  if (extra == null) return standingColumns;
  const column = extra === "placement" ? placementColumn : placingsColumn;
  return [...standingColumns.slice(0, -1), column, ...standingColumns.slice(-1)];
}

export default standingColumns;
