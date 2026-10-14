"use client";

import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { cn, getIconFor, getLogoForSchool } from "@/src/lib/utils";
import Image from "next/image";
import { Roboto } from "next/font/google";

import { StandingWithRank } from "./standings";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
              <Image
                src={getIconFor(data.sport)}
                alt={`${data.sport} icon`}
                width={24}
                height={24}
                className="w-6 h-6 object-contain brightness-0 invert"
              />
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
