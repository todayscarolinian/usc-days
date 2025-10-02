"use client";

import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Schedules } from "@/types/types";
import { format } from "date-fns";

import Badminton from "@/assets/icons/Diamond/Badminton.svg";
import Basketball from "@/assets/icons/Diamond/Basketball.svg";
import Cheerdance from "@/assets/icons/Diamond/Cheerdance.svg";
import Chess from "@/assets/icons/Diamond/Chess.svg";
import Esports from "@/assets/icons/Diamond/Esports.svg";
import FlagFootball from "@/assets/icons/Diamond/Flag Football.svg";
import Football from "@/assets/icons/Diamond/Football.svg";
import Frisbee from "@/assets/icons/Diamond/Frisbee.svg";
import Futsal from "@/assets/icons/Diamond/Futsal.svg";
import LawnTennis from "@/assets/icons/Diamond/Lawn Tennis.svg";
import MrIntrams from "@/assets/icons/Diamond/Mr Intrams.svg";
import MsIntrams from "@/assets/icons/Diamond/Ms Intrams.svg";
import Swimming from "@/assets/icons/Diamond/Swimming.svg";
import TableTennis from "@/assets/icons/Diamond/Table Tennis.svg";
import ThreeByThreeBasketball from "@/assets/icons/Diamond/ThreeByThreeBasketball.svg";
import Volleyball from "@/assets/icons/Diamond/Volleyball.svg";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const sportIcons: Record<string, React.JSX.Element> = {
  Badminton: (
    <Image src={Badminton} className="inline mr-2 size-6" alt="Badminton" />
  ),
  Basketball: (
    <Image src={Basketball} className="inline mr-2 size-6" alt="Basketball" />
  ),
  "Cheer Dance": (
    <Image src={Cheerdance} className="inline mr-2 size-6" alt="Cheer Dance" />
  ),
  Chess: <Image src={Chess} className="inline mr-2 size-6" alt="Chess" />,
  "E-Sports": (
    <Image src={Esports} className="inline mr-2 size-6" alt="Esports" />
  ),
  "Flag Football": (
    <Image
      src={FlagFootball}
      className="inline mr-2 size-6"
      alt="Flag Football"
    />
  ),
  Football: (
    <Image src={Football} className="inline mr-2 size-6" alt="Football" />
  ),
  Frisbee: <Image src={Frisbee} className="inline mr-2 size-6" alt="Frisbee" />,
  Futsal: <Image src={Futsal} className="inline mr-2 size-6" alt="Futsal" />,
  "Lawn Tennis": (
    <Image src={LawnTennis} className="inline mr-2 size-6" alt="Lawn Tennis" />
  ),
  "Mr. USC Days": (
    <Image src={MrIntrams} className="inline mr-2 size-6" alt="Mr. USC Days" />
  ),
  "Ms. USC Days": (
    <Image src={MsIntrams} className="inline mr-2 size-6" alt="Ms. USC Days" />
  ),
  Swimming: (
    <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
  ),
  "Table Tennis": (
    <Image
      src={TableTennis}
      className="inline mr-2 size-6"
      alt="Table Tennis"
    />
  ),
  "3x3 Basketball": (
    <Image
      src={ThreeByThreeBasketball}
      className="inline mr-2 size-6"
      alt={"3x3 Basketball"}
    />
  ),
  Volleyball: (
    <Image src={Volleyball} className="inline mr-2 size-6" alt="Volleyball" />
  ),
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
    accessorFn: (row) =>
      format(new Date(row.startDate), "MMMM d, yyyy, h:mm a"),
    header: () => <span className="font-bold sm:text-lg">Date</span>,
    cell: function CellComponent(info) {
      const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
      const dateString = info.getValue<string>();
      const date = new Date(dateString);

      const longDate = {
        date: format(date, "MMMM d"),
        time: format(date, "h:mm a"),
      };
      const shortDate = format(date, "MMM d");

      const handleTooltipToggle = () => {
        setIsTooltipOpen(!isTooltipOpen);
      };

      return (
        <>
          <span className="sm:text-[16px] hidden md:flex gap-2 items-center">
            <span>{longDate.date}</span>
            <span>{longDate.time}</span>
          </span>

          <div className="block md:hidden">
            <TooltipProvider>
              <Tooltip open={isTooltipOpen}>
                <TooltipTrigger onClick={handleTooltipToggle}>
                  <span className="sm:text-[16px]">{shortDate}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="sm:text-[16px] flex gap-2 items-center">
                    <span>{longDate.date}</span>
                    <span>{longDate.time}</span>
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      );
    },
    sortingFn: dateSortingFn,
    enableColumnFilter: true,
  },
  {
    id: "game",
    accessorKey: "sport",
    accessorFn: (row) => row.gameType.gameName,
    header: () => <span className="font-bold sm:text-lg">Sport</span>,
    cell: function CellComponent(info) {
      const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
      const sport = info.getValue<string>();

      // Find a matching sport key that is contained within the sport name
      const matchingSportKey = Object.keys(sportIcons).find((key) =>
        sport.includes(key)
      );

      const Icon = matchingSportKey ? sportIcons[matchingSportKey] : null; // Retrieve the icon from the mapping
      const handleTooltipToggle = () => {
        setIsTooltipOpen(!isTooltipOpen);
      };

      return (
        <span className="flex items-center justify-center md:justify-normal sm:text-[16px]">
          <TooltipProvider>
            <Tooltip open={isTooltipOpen}>
              <TooltipTrigger onClick={handleTooltipToggle}>
                {Icon}
              </TooltipTrigger>
              <TooltipContent>
                <span>{sport}</span>
              </TooltipContent>
            </Tooltip>
            <span className="hidden md:block">{sport}</span>
          </TooltipProvider>
        </span>
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "teams",
    accessorFn: (row) => `${row.teamA.teamName} vs ${row.teamB.teamName}`, // Flatten the teams object into a string
    header: () => <span className="font-bold sm:text-lg">Teams</span>,
    cell: (info) => {
      const teamA = info.row.original.teamA.teamName;
      const teamB = info.row.original.teamB.teamName;

      return (
        <span className="sm:text-[16px]">
          <span>{teamA}</span> <span className="opacity-50">vs</span>{" "}
          <span>{teamB}</span>
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
    id: "location",
    accessorKey: "location",
    header: () => <span className="font-bold sm:text-lg">Location</span>,
    cell: (info) => {
      const location = info.getValue<string>();

      return <span className="sm:text-[16px]">{location}</span>;
    },
    enableGlobalFilter: true,
  },
  {
    id: "status",
    accessorFn: (row) => {
      const scores = row.score;
      const scheduledDate = new Date(row.startDate);
      const endDate = new Date(row.endDate);
      const currentDate = new Date();

      const status =
        scores?.teamAScore && scores?.teamBScore
          ? "Finished"
          : currentDate.getTime() >= endDate.getTime() && !scores
          ? "Score Pending"
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

      if (filterValue) {
        return true;
      }

      return status !== "Finished";
    },
    enableColumnFilter: true,
  },
];
