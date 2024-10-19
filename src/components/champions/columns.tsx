"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Champions } from "@/types/types";
import { FaBasketballBall, FaVolleyballBall, FaSwimmer } from "react-icons/fa";
import { GiShuttlecock, GiTennisRacket } from "react-icons/gi";

const sportIcons: Record<string, JSX.Element> = {
  Basketball: <FaBasketballBall className="inline mr-2" />,
  Badminton: <GiShuttlecock className="inline mr-2" />,
  Volleyball: <FaVolleyballBall className="inline mr-2" />,
  Swimming: <FaSwimmer className="inline mr-2" />,
  "Lawn Tennis": <GiTennisRacket className="inline mr-2" />,
  // Add other sports and their icons here
};

export const championColumns: ColumnDef<Champions>[] = [
  {
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
  },
  {
    accessorKey: "team",
    header: () => <span className="font-bold sm:text-lg">Team</span>,
  },
];
