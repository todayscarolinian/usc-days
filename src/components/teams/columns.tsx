"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TeamInfo = {
	id: number;
	name: string;
	school: string;
};

export const teamMockData: TeamInfo[] = [
	{
		id: 1,
		name: "Team 1",
		school: "School 1",
	},
	{
		id: 2,
		name: "Team 2",
		school: "School 2",
	},
	{
		id: 3,
		name: "Team 3",
		school: "School 3",
	},
];

export const teamColumns: ColumnDef<TeamInfo>[] = [
	{
		accessorKey: "name",
		cell: (info) => info.getValue(),
		header: "Name",
	},
	{
		accessorKey: "school",
		cell: (info) => info.getValue(),
		header: "School",
	},
];
