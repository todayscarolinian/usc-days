"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { StandingData } from "@/src/types/types";
import { getLogoForSchool } from "@/src/lib/utils";

// Fallback function to get team icon or placeholder
const getTeamLogo = (teamName: string): React.JSX.Element => {
  const logo = getLogoForSchool(teamName);

  // test placeholder icon
  return (
    <>
      <Image
        src={logo}
        alt="Fallback Team Logo"
        className="inline size-6 mr-2"
      />
    </>
  );
};

const standingColumns: ColumnDef<StandingData>[] = [
  {
    accessorKey: "team",
    header: "TEAM",
    cell: (info) => {
      const teamName = info.getValue() as string;
      return (
        <>
          {getTeamLogo(teamName)}
          {teamName}
        </>
      );
    },
  },
  {
    accessorKey: "wins",
    header: "W",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "losses",
    header: "L",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "winPercentage",
    header: "WIN %",
    // convert to string with 2 decimal places and %
    cell: (info) => (info.getValue() as number).toFixed(2) + "%",
  },
];

export default standingColumns;
