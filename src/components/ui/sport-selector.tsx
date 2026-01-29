"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { SearchableSelect } from "@/src/components/ui/searchable-select";
import { Skeleton } from "@/src/components/ui/skeleton";
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
import Default from "@/src/assets/tc-logo-red.png";

const roboto = Roboto({
  weight: "300",
  subsets: ["latin"],
});

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

interface SportSelectorProps {
  onSelect: (id: number | null) => void;
  selected: number | null;
  triggerClassName?: string;
}

export default function SportSelector({
  onSelect,
  selected,
  triggerClassName = "",
}: SportSelectorProps) {
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/sports");
      const sports: GameType[] = response.data.sports;
      setGameTypes(sports.sort((a, b) => a.id - b.id));
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

  if (loading) {
    return (
      <div className="relative inline-block min-w-[272px]">
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
      <div className="relative inline-block min-w-[272px]">
        <div
          className={`${roboto.className} flex items-center justify-between px-6 py-[5px] w-full h-[54px] bg-red-50 shadow-sm rounded-[2px] border border-red-200 border-l-[2px] border-l-red-500`}
          style={{
            fontFamily: roboto.style.fontFamily,
            fontWeight: 300,
            fontSize: "14px",
            textTransform: "uppercase" as const,
          }}
        >
          <span className="text-red-600">{error || "No sports available"}</span>
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
      <SearchableSelect
        placeholder="Select a sport"
        searchPlaceholder="Search sports..."
        emptyMessage="No sports found."
        options={[
          {
            value: "",
            label: "All Sports",
            id: 0,
            icon: getIconFor("All Sports"),
          },
          ...gameTypes.map((sport) => ({
            value: sport.id.toString(),
            label: sport.gameName,
            id: sport.id,
            icon: getIconFor(sport.gameName),
          })),
        ]}
        value={selected ? selected.toString() : ""}
        onValueChange={(value) => onSelect(value ? parseInt(value) : null)}
        loading={loading}
        className={triggerClassName}
      />
    </div>
  );
}
