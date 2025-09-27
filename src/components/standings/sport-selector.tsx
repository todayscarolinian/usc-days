"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import * as Select from "@radix-ui/react-select";
import { ListFilter, RefreshCw } from "lucide-react";
import axios from "axios";

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
import Default from "@/assets/icons/Diamond/Esports.svg";

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

const getIconFor = (name: string) => {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const selectedSport = gameTypes.find((g) => g.id === selected);

    const baseTextStyle = {
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 300,
        fontSize: "14px",
        textTransform: "uppercase" as const,
    };

    //kinda takes a while if we fetch so might change this to static data later or other solution
    const fetchSports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get("/api/sports");
            setGameTypes(response.data.sports);
        } catch (err) {
            console.error("Error fetching sports:", err);
            setError("Failed to load sports.");
            setGameTypes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSports();
    }, []);

    // Show UI skeleton while loading since it takes a bit to load
    if (loading) {
        return (
            <div className="relative inline-block min-w-[272px]">
                <div
                    className="flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-gray-100 shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] animate-pulse"
                    style={baseTextStyle}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || gameTypes.length === 0) {
        return (
            <div className="relative inline-block min-w-[272px]">
                <div
                    className="flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-red-50 shadow-sm rounded-[2px] border border-red-200 border-l-[2px] border-l-red-500"
                    style={baseTextStyle}
                >
                    <span className="text-red-600">
                        {error || "No sports available"}
                    </span>
                    <button
                        onClick={fetchSports}
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
        <div className="relative inline-block min-w-[272px]">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap");

                .sport-select-content::-webkit-scrollbar {
                    width: 6px;
                }
                .sport-select-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sport-select-content::-webkit-scrollbar-thumb {
                    background-color: #999999;
                    border-radius: 9999px;
                }
                .sport-select-content::-webkit-scrollbar-thumb:hover {
                    background-color: #777777;
                }
            `}</style>

            <Select.Root
                value={selected ? selected.toString() : ""}
                onValueChange={(value) =>
                    onSelect(value ? parseInt(value) : null)
                }
            >
                <Select.Trigger
                    className="flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-white shadow-sm rounded-[2px] border border-neutral-200 border-l-[2px] transition-colors hover:border-l-tc_primary-500 data-[state=open]:border-l-tc_primary-500 outline-none"
                    style={baseTextStyle}
                >
                    <Select.Value placeholder="Select a sport">
                        {selectedSport ? (
                            <div className="flex items-center gap-3 flex-1 text-left">
                                {getIconFor(selectedSport.gameName)}
                                <span className="whitespace-nowrap">
                                    {selectedSport.gameName}
                                </span>
                            </div>
                        ) : (
                            <span className="text-neutral-500">
                                Select a sport
                            </span>
                        )}
                    </Select.Value>
                    <Select.Icon asChild>
                        <ListFilter className="h-6 w-6 text-neutral-400 mb-.7 ml-4 shrink-0" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        className="sport-select-content z-50 mt-2 w-[var(--radix-select-trigger-width)] max-h-56 overflow-y-auto bg-white shadow-lg border border-neutral-200 rounded-none"
                        position="popper"
                        sideOffset={8}
                    >
                        <Select.Viewport className="p-0">
                            {gameTypes.map((sport) => (
                                <Select.Item
                                    key={sport.id}
                                    value={sport.id.toString()}
                                    className="relative flex items-center justify-between p-4 text-left border-l-2 border-neutral-600 transition-colors hover:border-l-tc_primary-500 data-[highlighted]:border-l-tc_primary-500 data-[state=checked]:border-l-gray-400 overflow-hidden cursor-pointer outline-none"
                                    style={baseTextStyle}
                                >
                                    <Select.ItemText asChild>
                                        <span
                                            className="flex-1 text-left"
                                            style={baseTextStyle}
                                        >
                                            {sport.gameName}
                                        </span>
                                    </Select.ItemText>
                                    {getIconFor(sport.gameName)}
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}
