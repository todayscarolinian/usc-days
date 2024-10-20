"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TeamInfo = {
  id: number;
  teamName: string;
  schools: {
    id: number;
    schoolName: string;
  }[];
};

export const teamMockData: TeamInfo[] = [
  {
    id: 1,
    teamName: "Team 1",
    schools: [
      {
        id: 1,
        schoolName: "School 1",
      },
    ],
  },
  {
    id: 2,
    teamName: "Team 2",
    schools: [
      {
        id: 1,
        schoolName: "School 1",
      },
      {
        id: 2,
        schoolName: "School 2",
      },
    ],
  },
  {
    id: 3,
    teamName: "Team 3",
    schools: [
      {
        id: 1,
        schoolName: "School 1",
      },
    ],
  },
];

export const teamColumns: ColumnDef<TeamInfo>[] = [
  {
    accessorKey: "teamName",
    cell: (info) => info.getValue(),
    header: "Name",
  },
  {
    accessorKey: "school",
    accessorFn: (row) => row.schools.map((school) => school.schoolName).join(", "),
    cell: (info) => {
      const schoolData = info.getValue<string>();

      return (
        <div className="grid grid-cols-2 gap-2">
          {schoolData?.split(", ").map((school) => {
            return (
              <div
                key={school}
                className="flex justify-center items-center py-1 px-4 rounded-full bg-tc_primary text-white"
              >
                <span className="font-bold">{school}</span>
              </div>
            );
          })}
        </div>
      );
    },
    header: "School",
  },
];
