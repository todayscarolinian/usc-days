"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FaBasketballBall, FaVolleyballBall, FaSwimmer } from "react-icons/fa";
import { GiShuttlecock, GiTennisRacket } from "react-icons/gi";

export type SportInfo = {
	id: number;
	name: string;
	teams: {
		id: number;
		name: string;
	}[];
};

export const sportMockData: SportInfo[] = [
	{
		id: 1,
		name: "Badminton",
		teams: [
			{
				id: 1,
				name: "Lakers",
			},
		],
	},
	{
		id: 2,
		name: "Basketball",
		teams: [
			{
				id: 1,
				name: "Lakers",
			},
			{
				id: 2,
				name: "Celtics",
			},
			{
				id: 3,
				name: "Warriors",
			},
		],
	},
	{
		id: 3,
		name: "Swimming",
		teams: [
			{
				id: 1,
				name: "Lakers",
			},
			{
				id: 3,
				name: "Warriors",
			},
		],
	},
	{
		id: 4,
		name: "Lawn Tennis",
		teams: [
			{
				id: 2,
				name: "Celtics",
			},
		],
	},
	{
		id: 5,
		name: "Volleyball",
		teams: [
			{
				id: 2,
				name: "Celtics",
			},
		],
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

export const sportColumns: ColumnDef<SportInfo>[] = [
	{
		accessorKey: "name",
		cell: (info) => {
			const name = info.getValue<string>();
			const Icon = sportIcons[name];
			return (
				<div className="flex items-center">
					{Icon}
					<span>{name}</span>
				</div>
			);
		},
		header: "Name",
	},
	{
        accessorKey: "teams",
        accessorFn: (row) => row.teams.map(team => team.name).join(", "),
		cell: (info) => {
            const teamData = info.getValue<string>();
            console.log(teamData);
            
			return (
                <div className="grid grid-cols-4 gap-2">
					{teamData?.split(", ").map((team) => {
						const Icon = sportIcons[team];
						return (
							<div
								key={team}
								className="flex justify-center items-center py-1 px-4 rounded-full bg-tc_primary text-white"
							>
								<span className="bg-yellow 500">{Icon}</span>
								<span className="font-bold">{team}</span>
							</div>
						);
					})}
				</div>
			);
		},
		header: "Teams",
	},
];
