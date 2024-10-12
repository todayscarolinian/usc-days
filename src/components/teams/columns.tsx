"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaBasketballBall, FaVolleyballBall, FaSwimmer } from "react-icons/fa";
import { GiShuttlecock, GiTennisRacket } from "react-icons/gi";

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

const sportIcons: Record<string, JSX.Element> = {
	Basketball: <FaBasketballBall className="inline mr-2" />,
	Badminton: <GiShuttlecock className="inline mr-2" />,
	Volleyball: <FaVolleyballBall className="inline mr-2" />,
	Swimming: <FaSwimmer className="inline mr-2" />,
	"Lawn Tennis": <GiTennisRacket className="inline mr-2" />,
	// Add other sports and their icons here
};

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
