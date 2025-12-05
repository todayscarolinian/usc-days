"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Default from "@/assets/tc-logo-red.png"; //temporary for testing
import { StandingData } from "@/types/types";

// Team icons mapping - add team logos here when available
const teamIcons: Record<string, React.JSX.Element> = {
    // Add team mappings like:
    // "Team A": <Image src={TeamALogo} className="inline mr-2 size-6" alt="Team A" />,
    // "Team B": <Image src={TeamBLogo} className="inline mr-2 size-6" alt="Team B" />,
};

// Fallback function to get team icon or placeholder
const getTeamIcon = (teamName: string): React.JSX.Element => {
    const matchingTeamKey = Object.keys(teamIcons).find((key) =>
        teamName.includes(key)
    );

    if (matchingTeamKey) {
        return teamIcons[matchingTeamKey];
    }

    // test placeholder icon
    return (
        <>
            <Image
                src={Default}
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
                    {getTeamIcon(teamName)}
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
