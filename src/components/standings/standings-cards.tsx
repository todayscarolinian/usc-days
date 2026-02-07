"use client";

import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { cn, getLogoForSchool } from "@/src/lib/utils";
import Image from "next/image";
import { Roboto } from "next/font/google";

import Badminton from "@/src/assets/icons/Diamond/Badminton.svg";
import Basketball from "@/src/assets/icons/Diamond/Basketball.svg";
import Cheerdance from "@/src/assets/icons/Diamond/Cheerdance.svg";
import Chess from "@/src/assets/icons/Diamond/Chess.svg";
import Esports from "@/src/assets/icons/Diamond/Esports.svg";
import FlagFootball from "@/src/assets/icons/Diamond/Flag Football.svg";
import Football from "@/src/assets/icons/Diamond/Football.svg";
import Frisbee from "@/src/assets/icons/Diamond/Frisbee.svg";
import Futsal from "@/src/assets/icons/Diamond/Futsal.svg";
import LawnTennis from "@/src/assets/icons/Diamond/Lawn Tennis.svg";
import MrIntrams from "@/src/assets/icons/Diamond/Mr Intrams.svg";
import MsIntrams from "@/src/assets/icons/Diamond/Ms Intrams.svg";
import Swimming from "@/src/assets/icons/Diamond/Swimming.svg";
import TableTennis from "@/src/assets/icons/Diamond/Table Tennis.svg";
import ThreeByThreeBasketball from "@/src/assets/icons/Diamond/ThreeByThreeBasketball.svg";
import Volleyball from "@/src/assets/icons/Diamond/Volleyball.svg";
import Default from "@/src/assets/tc-logo-red.png"; //temporary for testing - change once fallback icon is ready
import { StandingWithRank } from "./standings";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
    <Image src={Chess} alt="Chess" className="w-6 h-6 brightness-0 invert" />
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
    <Image src={Futsal} alt="Futsal" className="w-6 h-6 brightness-0 invert" />
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
    <Image src={Default} alt="icon" className="w-6 h-6 brightness-0 invert" />
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
      throw new Error(`Invalid rank: ${rank}`);
  }
};

const getTeamLogo = (teamName: string): React.JSX.Element => {
  const logo = getLogoForSchool(teamName);

  // test placeholder icon
  return (
    <>
      <Image
        src={logo}
        alt="Fallback Team Logo"
        className="inline size-20 mr-2"
      />
    </>
  );
};

interface CardsProps {
  data: StandingWithRank;
  onSelect: () => void;
}

export default function Cards({ data, onSelect }: CardsProps) {
  const isEmpty = data.team === "TBD";
  const rankInfo = getRankInfo(data.rank);
  return (
    <Card
      className="h-47.75 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.01] transition"
      onClick={onSelect}
    >
      <CardContent
        className={cn(
          "flex-1 flex items-center justify-between",
          "p-6! pb-0! pt-0! mb-0!",
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
            title={data.team}
          >
            {data.team}
          </h3>

          <div className="flex gap-6">
            <div>
              <p
                className="text-gray-500 uppercase mb-1"
                style={{
                  fontFamily: roboto.style.fontFamily,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                GAMES WON
              </p>
              <p
                style={{
                  fontFamily: roboto.style.fontFamily,
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {isEmpty ? "-" : data.wins}
              </p>
            </div>
            <div>
              <p
                className="text-gray-500 uppercase mb-1"
                style={{
                  fontFamily: roboto.style.fontFamily,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                WIN %
              </p>
              <p
                style={{
                  fontFamily: roboto.style.fontFamily,
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {isEmpty ? "-" : `${data.winPercentage.toFixed(2)}%`}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-4">
          {isEmpty ? (
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">?</span>
            </div>
          ) : (
              getTeamLogo(data.team)
          )}
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex items-center justify-between shrink-0",
          "h-10! px-6! py-4! mt-0! mb-0!",
        )}
        style={{
          backgroundColor: rankInfo.bgColor,
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {data.sport && (
            <>
              {getIconFor(data.sport)}
              <span
                className="text-white uppercase truncate"
                style={{
                  fontFamily: roboto.style.fontFamily,
                  fontSize: "14px",
                  fontWeight: "700",
                }}
                title={data.sport}
              >
                {data.sport}
              </span>
            </>
          )}
        </div>
        <span
          className="text-white uppercase shrink-0 ml-2"
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
}
