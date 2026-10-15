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
    accessorKey: "winPercentage",
    header: "Win %",
    cell: ({ row }) => `${row.original.winPercentage.toFixed(2)}%`,
  },
];

export default standingColumns;





// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import Image from "next/image";
// import { StandingData } from "@/src/types/types";
// import { getLogoForSchool } from "@/src/lib/utils";

// // Fallback function to get team icon or placeholder
// const getTeamLogo = (teamName: string): React.JSX.Element => {
//   const logo = getLogoForSchool(teamName);

//   // test placeholder icon
//   return (
//     <>
//       <Image
//         src={logo}
//         alt="Fallback Team Logo"
//         className="inline size-6 mr-2"
//       />
//     </>
//   );
// };

// const standingColumns: ColumnDef<StandingData>[] = [
//   {
//     accessorKey: "team",
//     header: "TEAM",
//     cell: (info) => {
//       const teamName = info.getValue() as string;
//       return (
//         <>
//           {getTeamLogo(teamName)}
//           {teamName}
//         </>
//       );
//     },
//   },
//   {
//     accessorKey: "wins",
//     header: "W",
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "losses",
//     header: "L",
//     cell: (info) => info.getValue(),
//   },
//   {
//     accessorKey: "winPercentage",
//     header: "WIN %",
//     // convert to string with 2 decimal places and %
//     cell: (info) => (info.getValue() as number).toFixed(2) + "%",
//   },
// ];

// export default standingColumns;
