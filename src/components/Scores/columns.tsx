"use client";

import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Scores } from "@/types/types";
import { Champions } from "@/types/types";
import { 
  FaBasketballBall, 
  FaVolleyballBall, 
  FaSwimmer, 
  FaRegEdit 
} from "react-icons/fa";
import { 
  GiShuttlecock, 
  GiTennisRacket 
} from "react-icons/gi";
import { formatLongDate } from "@/lib/utils";

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
      const date = info.getValue<string>();
      
      const formattedDate = formatLongDate(date);

      return (
        <span className="sm:text-[16px]">{formattedDate}</span>
      )
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
        <span className="flex items-center sm:text-[16px]">
          {Icon}
          {sport}
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
      return (
      <span className="sm:text-[16px]">
        {teams.home} <span className="opacity-50">vs</span> {teams.away}
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

      return (
        <span className="sm:text-[16px]">{score}</span>
      )
    }
  },
  {
    id: "winner",
    accessorKey: "winner",
    header: () => <span className="font-bold sm:text-lg">Winner</span>,
    cell: (info) => {
      const winner = info.getValue<string>();

      return (
        <span className="sm:text-[16px]">{winner}</span>
      )
    }
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
