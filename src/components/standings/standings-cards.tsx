"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
import Default from "@/assets/icons/Diamond/Esports.svg";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    display: "swap",
});

type ChampionCard = {
    team: string;
    wins: number;
    winPct: string;
    rank: number;
    gameType: string;
};

interface CardsProps {
    data: ChampionCard[];
    currentSport?: string;
}

const sportIcons: Record<string, React.JSX.Element> = {
    Badminton: (
        <Image
            src={Badminton}
            alt="Badminton"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Basketball: (
        <Image
            src={Basketball}
            alt="Basketball"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Cheer Dance": (
        <Image
            src={Cheerdance}
            alt="Cheer Dance"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Chess: (
        <Image
            src={Chess}
            alt="Chess"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "E-Sports": (
        <Image
            src={Esports}
            alt="Esports"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Flag Football": (
        <Image
            src={FlagFootball}
            alt="Flag Football"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Football: (
        <Image
            src={Football}
            alt="Football"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Frisbee: (
        <Image
            src={Frisbee}
            alt="Frisbee"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Futsal: (
        <Image
            src={Futsal}
            alt="Futsal"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Lawn Tennis": (
        <Image
            src={LawnTennis}
            alt="Lawn Tennis"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Mr. USC Days": (
        <Image
            src={MrIntrams}
            alt="Mr. USC Days"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Ms. USC Days": (
        <Image
            src={MsIntrams}
            alt="Ms. USC Days"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Swimming: (
        <Image
            src={Swimming}
            alt="Swimming"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "Table Tennis": (
        <Image
            src={TableTennis}
            alt="Table Tennis"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    "3x3 Basketball": (
        <Image
            src={ThreeByThreeBasketball}
            alt="3x3 Basketball"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
    Volleyball: (
        <Image
            src={Volleyball}
            alt="Volleyball"
            className="w-6 h-6 brightness-0 invert"
        />
    ),
};

const getIconFor = (name: string) => {
    const key = Object.keys(sportIcons).find((k) => name.includes(k));
    return key ? (
        sportIcons[key]
    ) : (
        <Image
            src={Default}
            alt="icon"
            className="w-6 h-6 brightness-0 invert"
        />
    );
};

const getRankInfo = (rank: number) => {
    switch (rank) {
        case 1:
            return {
                title: "CHAMPION",
                bgColor: "#907C4B",
            };
        case 2:
            return {
                title: "FIRST RUNNER-UP",
                bgColor: "#727272",
            };
        case 3:
            return {
                title: "SECOND RUNNER-UP",
                bgColor: "#683C13",
            };
        default:
            return {
                title: `RANK ${rank}`,
                bgColor: "#6b7280",
            };
    }
};

const getTeamLogo = (teamName: string): React.JSX.Element => {
    // Placeholder logo - replace when team logos are ready
    return (
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
                {teamName.charAt(0).toUpperCase()}
            </span>
        </div>
    );
};

export default function Cards({ data, currentSport }: CardsProps) {
    const sortedData = [...data].sort((a, b) => a.rank - b.rank);

    // array with placeholders for missing ranks
    const paddedData: ChampionCard[] = [];

    for (let rank = 1; rank <= 3; rank++) {
        const existingChampion = sortedData.find(
            (champion) => champion.rank === rank
        );

        if (existingChampion) {
            paddedData.push(existingChampion);
        } else {
            paddedData.push({
                team: "TBD",
                wins: 0,
                winPct: "0%",
                rank: rank,
                gameType: currentSport || "", // Use current sport for TBD cards
            });
        }
    }

    return (
        <div
            className={`grid grid-cols-1 xl:grid-cols-3 gap-6 w-full ${roboto.className}`}
        >
            {paddedData.slice(0, 3).map((champion, index) => {
                const rankInfo = getRankInfo(champion.rank);
                const isEmpty = champion.team === "TBD";

                return (
                    <Card
                        key={index}
                        className="h-[191px] overflow-hidden flex flex-col"
                    >
                        <CardContent
                            className={cn(
                                "flex-1 flex items-center justify-between",
                                "!p-6 !pb-0 !pt-0 !mb-0"
                            )}
                        >
                            <div className="flex-1">
                                <h3
                                    className="uppercase leading-tight mb-2 truncate"
                                    style={{
                                        fontFamily: roboto.style.fontFamily,
                                        fontSize: "32px",
                                        fontWeight: "700",
                                    }}
                                    title={isEmpty ? "TBD" : champion.team} // Show full name on hover
                                >
                                    {isEmpty ? "TBD" : champion.team}
                                </h3>

                                <div className="flex gap-6">
                                    <div>
                                        <p
                                            className="text-gray-500 uppercase mb-1"
                                            style={{
                                                fontFamily:
                                                    roboto.style.fontFamily,
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            GAMES WON
                                        </p>
                                        <p
                                            style={{
                                                fontFamily:
                                                    roboto.style.fontFamily,
                                                fontSize: "20px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {isEmpty ? "-" : champion.wins}
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            className="text-gray-500 uppercase mb-1"
                                            style={{
                                                fontFamily:
                                                    roboto.style.fontFamily,
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            WIN %
                                        </p>
                                        <p
                                            style={{
                                                fontFamily:
                                                    roboto.style.fontFamily,
                                                fontSize: "20px",
                                                fontWeight: "700",
                                            }}
                                        >
                                            {isEmpty ? "-" : champion.winPct}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-4">
                                {isEmpty ? (
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">
                                            ?
                                        </span>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-600">
                                            {champion.team
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter
                            className={cn(
                                "flex items-center justify-between flex-shrink-0",
                                "!h-[40px] !px-6 !py-4 !mt-0 !mb-0"
                            )}
                            style={{
                                backgroundColor: rankInfo.bgColor,
                                borderBottomLeftRadius: "inherit",
                                borderBottomRightRadius: "inherit",
                            }}
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {champion.gameType && (
                                    <>
                                        {getIconFor(champion.gameType)}
                                        <span
                                            className="text-white uppercase truncate"
                                            style={{
                                                fontFamily:
                                                    roboto.style.fontFamily,
                                                fontSize: "14px",
                                                fontWeight: "700",
                                            }}
                                            title={champion.gameType}
                                        >
                                            {champion.gameType}
                                        </span>
                                    </>
                                )}
                            </div>
                            <span
                                className="text-white uppercase flex-shrink-0 ml-2"
                                style={{
                                    fontFamily: roboto.style.fontFamily,
                                    fontSize: "14px",
                                    fontWeight: "700",
                                }}
                            >
                                {rankInfo.title}
                            </span>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
