"use client";

import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Scores } from "@/types/types";
import { Champions } from "@/types/types";
import { FaBasketballBall, FaVolleyballBall, FaSwimmer } from "react-icons/fa";
import { GiShuttlecock, GiTennisRacket } from "react-icons/gi";
import { formatLongDate } from "@/lib/utils";
import { format } from "date-fns";

const sportIcons: Record<string, JSX.Element> = {
  Basketball: <FaBasketballBall className="inline mr-2" />,
  Badminton: <GiShuttlecock className="inline mr-2" />,
  Volleyball: <FaVolleyballBall className="inline mr-2" />,
  Swimming: <FaSwimmer className="inline mr-2" />,
  "Lawn Tennis": <GiTennisRacket className="inline mr-2" />,
  // Add other sports and their icons here
};

const dateSortingFn: SortingFn<Scores> = (rowA, rowB, columnId) => {
  const dateStrA = rowA.getValue<string>(columnId);
  const dateStrB = rowB.getValue<string>(columnId);

  // Convert the formatted date strings to Date objects
  const dateA = new Date(dateStrA);
  const dateB = new Date(dateStrB);

  // Compare the Date objects (ascending order)
  return dateA.getTime() - dateB.getTime();
};

export const scoreColumns: ColumnDef<Scores>[] = [
  {
    id: "date",
    accessorFn: (row) => formatLongDate(row.date), // Create derived field
    header: () => <span className="font-bold sm:text-lg">Date</span>,
    cell: (info) => {
      const dateString = info.getValue<string>();
      const date = new Date(dateString);

      const longDate = {
        date: format(date, "MMMM d"),
        time: format(date, "h:mm a"),
      };
      const shortDate = format(date, "MMM d");

      return (
        <>
          <span className="sm:text-[16px] hidden md:flex gap-2 items-center">
            <span>{longDate.date}</span>
            {/* <span className="opacity-50">-</span> */}
            <span>{longDate.time}</span>
          </span>
          <span className="sm:text-[16px] block md:hidden">{shortDate}</span>
        </>
      );
    },
    sortingFn: dateSortingFn,
    enableColumnFilter: true,
  },
  {
    id: "game",
    accessorKey: "sport",
    header: () => <span className="font-bold sm:text-lg">Sport</span>,
    cell: (info) => {
      const sport = info.getValue<string>();
      const Icon = sportIcons[sport]; // Retrieve the icon from the mapping

      return (
        <span className="flex items-center justify-center md:justify-normal sm:text-[16px]">
          {Icon}
          <span className="hidden md:block">{sport}</span>
        </span>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "teams",
    accessorFn: (row) => `${row.teams.home} vs ${row.teams.away}`, // Flatten the teams object into a string
    header: () => <span className="font-bold sm:text-lg">Teams</span>,
    cell: (info) => {
      const teams = info.row.original.teams;
      const winner = info.row.original.winner;

      return (
        <span className="sm:text-[16px]">
          <span
            className={
              winner === teams.home
                ? "font-bold underline md:font-normal md:no-underline"
                : ""
            }
          >
            {teams.home}
          </span>{" "}
          <span className="opacity-50">vs</span>{" "}
          <span
            className={
              winner === teams.away
                ? "font-bold underline md:font-normal md:no-underline"
                : ""
            }
          >
            {teams.away}
          </span>
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      // Get the teams string (already flattened in accessorFn)
      const teams = row.getValue(columnId) as string;
      // Perform filtering (case-insensitive includes check)
      return teams.toLowerCase().includes(filterValue.toLowerCase());
    },
    enableColumnFilter: true,
  },
  {
    id: "score",
    accessorFn: (row) => `${row.scores.home} vs ${row.scores.away}`,
    header: () => <span className="font-bold sm:text-lg">Score</span>,
    cell: (info) => {
      const score = info.getValue<string>();

      return <span className="sm:text-[16px]">{score}</span>;
    },
  },
  {
    id: "winner",
    accessorKey: "winner",
    header: () => <span className="font-bold sm:text-lg">Winner</span>,
    cell: (info) => {
      const winner = info.getValue<string>();

      return <span className="sm:text-[16px]">{winner}</span>;
    },
  },
];

export const championColumns: ColumnDef<Champions>[] = [
  {
    accessorKey: "sport",
    header: () => <span>Sport</span>,
  },
  {
    accessorKey: "team",
    header: () => <span>Team</span>,
  },
];
