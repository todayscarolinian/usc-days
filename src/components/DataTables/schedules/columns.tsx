"use client";

import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Schedules } from "@/types/types";
import { FaBasketballBall, FaVolleyballBall, FaSwimmer } from "react-icons/fa";
import { GiShuttlecock, GiTennisRacket } from "react-icons/gi";
import { format } from "date-fns";

const sportIcons: Record<string, JSX.Element> = {
  Basketball: <FaBasketballBall className="inline mr-2" />,
  Badminton: <GiShuttlecock className="inline mr-2" />,
  Volleyball: <FaVolleyballBall className="inline mr-2" />,
  Swimming: <FaSwimmer className="inline mr-2" />,
  "Lawn Tennis": <GiTennisRacket className="inline mr-2" />,
  // Add other sports and their icons here
};

const dateSortingFn: SortingFn<Schedules> = (rowA, rowB, columnId) => {
  const dateStrA = rowA.getValue<string>(columnId);
  const dateStrB = rowB.getValue<string>(columnId);

  // Convert the formatted date strings to Date objects
  const dateA = new Date(dateStrA);
  const dateB = new Date(dateStrB);

  // Compare the Date objects (ascending order)
  return dateB.getTime() - dateA.getTime();
};

export const scheduleColumns: ColumnDef<Schedules>[] = [
  {
    id: "date",
    accessorFn: (row) => format(new Date(row.date), "MMMM d, yyyy, h:mm a"),
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

      return (
        <span className="sm:text-[16px]">
          {teams.home} <span className="opacity-50">vs</span> {teams.away}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const teams = row.getValue(columnId) as string;

      return teams.toLowerCase().includes(filterValue.toLowerCase());
    },
    enableColumnFilter: true,
  },
  {
    id: "location",
    accessorKey: "location",
    header: () => <span className="font-bold sm:text-lg">Location</span>,
    cell: (info) => {
      const location = info.getValue<string>();

      return <span className="sm:text-[16px]">{location}</span>;
    },
  },
  {
    id: "status",
    accessorFn: (row) => {
      const scores = row.scores;
      const scheduledDate = new Date(row.date);
      const currentDate = new Date();

      const status =
        scores?.home && scores?.away
          ? "Finished"
          : currentDate.getTime() >= scheduledDate.getTime()
          ? "Ongoing"
          : "Not Started";

      return status;
    },
    accessorKey: "status",
    header: () => <span className="font-bold sm:text-lg">Status</span>,
    cell: (info) => {
      const status = info.getValue<string>();

      return <span className="sm:text-[16px]">{status}</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      const status = row.getValue(columnId) as string;
      return true;
      // return teams.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
];
