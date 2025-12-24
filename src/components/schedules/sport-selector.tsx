"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getGameTypesQuery } from "@/queries/gametypes.queries";
import { ListFilter, RefreshCw } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Roboto } from "next/font/google";

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
import Default from "@/assets/tc-logo-red.png"; //temporary for testing - change once fallback icon is ready

const roboto = Roboto({
    weight: "300",
    subsets: ["latin"],
});

interface SportSelectorProps {
    onSelect: (id: number | null) => void;
    selected: number | null;
}

type GameType = {
    id: number;
    gameName: string;
};

const sportIcons: Record<string, React.JSX.Element> = {
    Badminton: <Image src={Badminton} alt="Badminton" className="size-6" />,
    Basketball: <Image src={Basketball} alt="Basketball" className="size-6" />,
    "Cheer Dance": (
        <Image src={Cheerdance} alt="Cheer Dance" className="size-6" />
    ),
    Chess: <Image src={Chess} alt="Chess" className="size-6" />,
    "E-Sports": <Image src={Esports} alt="Esports" className="size-6" />,
    "Flag Football": (
        <Image src={FlagFootball} alt="Flag Football" className="size-6" />
    ),
    Football: <Image src={Football} alt="Football" className="size-6" />,
    Frisbee: <Image src={Frisbee} alt="Frisbee" className="size-6" />,
    Futsal: <Image src={Futsal} alt="Futsal" className="size-6" />,
    "Lawn Tennis": (
        <Image src={LawnTennis} alt="Lawn Tennis" className="size-6" />
    ),
    "Mr. USC Days": (
        <Image src={MrIntrams} alt="Mr. USC Days" className="size-6" />
    ),
    "Ms. USC Days": (
        <Image src={MsIntrams} alt="Ms. USC Days" className="size-6" />
    ),
    Swimming: <Image src={Swimming} alt="Swimming" className="size-6" />,
    "Table Tennis": (
        <Image src={TableTennis} alt="Table Tennis" className="size-6" />
    ),
    "3x3 Basketball": (
        <Image
            src={ThreeByThreeBasketball}
            alt="3x3 Basketball"
            className="size-6"
        />
    ),
    Volleyball: <Image src={Volleyball} alt="Volleyball" className="size-6" />,
};

const swimmingAliases = [
    "Freestyle",
    "Backstroke",
    "Butterfly",
    "Breaststroke",
    "Medley",
    "Relay",
];

const getIconFor = (name: string) => {
    if (swimmingAliases.some((alias) => name.includes(alias))) {
        return sportIcons["Swimming"];
    }

    const key = Object.keys(sportIcons).find((k) => name.includes(k));

    return key ? (
        sportIcons[key]
    ) : (
        <Image src={Default} alt="icon" className="size-6" />
    );
};

export default function SportSelector({
    onSelect,
    selected,
}: SportSelectorProps) {
    const [gameTypes, setGameTypes] = useState<GameType[]>([]);

    const selectedSport = gameTypes.find((g) => g.id === selected);

    const baseTextStyle = {
        fontFamily: roboto.style.fontFamily,
        fontWeight: 300,
        fontSize: "14px",
        textTransform: "uppercase" as const,
    };

    const {
        data: sportsData = [],
        error,
        isLoading: loading,
    } = getGameTypesQuery();

    useEffect(() => {
        if (sportsData.length > 0) {
            setGameTypes(sportsData);
        }
    }, [sportsData]);

    // Set default to "All Sports" when component mounts
    useEffect(() => {
        if (selected === null && !loading) {
            onSelect(null);
        }
    }, [loading, selected, onSelect]);

    if (loading) {
        return (
            <div className="relative inline-block max-w-64">
                <div className="flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px]">
                    <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                </div>
            </div>
        );
    }

    if (error || gameTypes.length === 0) {
        return (
            <div className="relative inline-block max-w-64">
                <div
                    className={`${roboto.className} flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-red-50 shadow-sm rounded-[2px] border border-red-200 border-l-[2px] border-l-red-500`}
                    style={baseTextStyle}
                >
                    <span className="text-red-600">
                        {error?.message || "No sports available"}
                    </span>
                    <button
                        onClick={getGameTypesQuery}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Retry loading sports"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="text-xs">Retry</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative inline-block max-w-64">
            <Select
                value={selected === null ? "0" : selected.toString()}
                onValueChange={(value) =>
                    onSelect(value === "0" ? null : parseInt(value))
                }
            >
                <SelectTrigger
                    size={undefined}
                    className={`${roboto.className} flex items-center justify-between !px-[22px] !py-[7px] !h-[54px] w-full bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none [&>svg.size-4.opacity-50]:hidden`}
                    style={baseTextStyle}
                >
                    <div className="flex items-center gap-3 flex-1 text-left">
                        {selected === null || selectedSport ? (
                            <>
                                {selected === null ? (
                                    <Image
                                        src={Default}
                                        alt="All Sports"
                                        className="size-6"
                                    />
                                ) : (
                                    getIconFor(selectedSport!.gameName)
                                )}
                                <span className="whitespace-nowrap">
                                    {selected === null
                                        ? "All Sports"
                                        : selectedSport!.gameName}
                                </span>
                            </>
                        ) : (
                            <span className="text-neutral-500">
                                Select a sport
                            </span>
                        )}
                    </div>

                    <ListFilter className="!h-6 !w-6 text-neutral-400 ml-3 shrink-0" />
                </SelectTrigger>

                <SelectContent
                    className="z-50 mt-2 bg-white shadow-lg border border-neutral-200 rounded-none w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-56 overflow-y-auto [&>[data-radix-select-viewport]]:p-0"
                    position="popper"
                    sideOffset={8}
                >
                    <SelectItem
                        value="0"
                        style={baseTextStyle}
                        className="relative flex items-start w-full pl-4 pr-0 py-4 text-left border-l-2 border-neutral-600 transition-colors hover:border-l-tc_primary-500 data-[state=checked]:border-l-gray-400 cursor-pointer outline-none rounded-none [&>span:first-of-type]:!opacity-0 [&>span:first-of-type]:!w-0 [&>span:first-of-type]:!h-0 [&>span:first-of-type]:!overflow-hidden"
                    >
                        <span className="block whitespace-normal break-words pr-10">
                            All Sports
                        </span>

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex-shrink-0 pointer-events-none">
                            <Image
                                src={Default}
                                alt="All Sports"
                                className="size-6"
                            />
                        </div>
                    </SelectItem>
                    {gameTypes.map((sport) => (
                        <SelectItem
                            key={sport.id}
                            value={sport.id.toString()}
                            style={baseTextStyle}
                            className="relative flex items-start w-full pl-4 pr-0 py-4 text-left border-l-2 border-neutral-600 transition-colors hover:border-l-tc_primary-500 data-[state=checked]:border-l-gray-400 cursor-pointer outline-none rounded-none [&>span:first-of-type]:!opacity-0 [&>span:first-of-type]:!w-0 [&>span:first-of-type]:!h-0 [&>span:first-of-type]:!overflow-hidden"
                        >
                            <span className="block whitespace-normal break-words pr-10">
                                {sport.gameName}
                            </span>

                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex-shrink-0 pointer-events-none">
                                {getIconFor(sport.gameName)}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
