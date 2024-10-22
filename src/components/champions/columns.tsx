"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Champions } from "@/types/types";

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

const sportIcons: Record<string, JSX.Element> = {
    Badminton: (
        <Image src={Badminton} className="inline mr-2 size-6" alt="Badminton" />
    ),
    Basketball: (
        <Image
            src={Basketball}
            className="inline mr-2 size-6"
            alt="Basketball"
        />
    ),
    "Cheer Dance": (
        <Image
            src={Cheerdance}
            className="inline mr-2 size-6"
            alt="Cheer Dance"
        />
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
    Frisbee: (
        <Image src={Frisbee} className="inline mr-2 size-6" alt="Frisbee" />
    ),
    Futsal: <Image src={Futsal} className="inline mr-2 size-6" alt="Futsal" />,
    "Lawn Tennis": (
        <Image
            src={LawnTennis}
            className="inline mr-2 size-6"
            alt="Lawn Tennis"
        />
    ),
    "Mr. USC Days": (
        <Image
            src={MrIntrams}
            className="inline mr-2 size-6"
            alt="Mr. USC Days"
        />
    ),
    "Ms. USC Days": (
        <Image
            src={MsIntrams}
            className="inline mr-2 size-6"
            alt="Ms. USC Days"
        />
    ),
    Swimming: (
        <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
    ),
    "Freestyle": (
        <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
    ),
    "stroke": (
        <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
    ),
    "butterfly": (
        <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
    ),
    "relay": (
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
        <Image
            src={Volleyball}
            className="inline mr-2 size-6"
            alt="Volleyball"
        />
    ),
};

export const championColumns: ColumnDef<Champions>[] = [
    {
        id: "sport",
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
    },
    {
        accessorKey: "team",
        accessorFn: (row) => row.team.teamName,
        header: () => <span className="font-bold sm:text-lg">Team</span>,
    },
    {
        accessorKey: "rank",
        accessorFn: (row) => row.rank,
        header: () => <span className="font-bold sm:text-lg">Rank</span>,
        cell: (info) => {
            const data = info.getValue<number>();

            const rank =
                data === 1
                    ? <span className="font-bold">Champion</span>
                    : data === 2
                    ? <span>First Runner Up</span>
                    : <span>Second Runner Up</span>;

            return rank;
        },
    },
];
