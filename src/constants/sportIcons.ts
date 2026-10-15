import TCRedLogo from "@/src/assets/tc-logo-red.png";
import Badminton from "@/src/assets/icons/Diamond/Badminton.png";
import Basketball from "@/src/assets/icons/Diamond/Basketball.png";
import Cheerdance from "@/src/assets/icons/Diamond/Cheerdance.png";
import Chess from "@/src/assets/icons/Diamond/Chess.png";
import ContemporaryDance from "@/src/assets/icons/Diamond/Contemporarydance.png";
import Esports from "@/src/assets/icons/Diamond/ESports.png";
import FlagFootball from "@/src/assets/icons/Diamond/Flag Football.png";
import Frisbee from "@/src/assets/icons/Diamond/Frisbee.png";
import Futsal from "@/src/assets/icons/Diamond/Futsal.png";
import LawnTennis from "@/src/assets/icons/Diamond/Lawn Tennis.png";
import MrAndMsUSC from "@/src/assets/icons/Diamond/Mr. & Ms. USC.png";
import Pickleball from "@/src/assets/icons/Diamond/Pickleball.png";
import Soccer from "@/src/assets/icons/Diamond/Soccer.png";
import Swimming from "@/src/assets/icons/Diamond/Swimming.png";
import TableTennis from "@/src/assets/icons/Diamond/Table Tennis.png";
import Volleyball from "@/src/assets/icons/Diamond/Volleyball.png";
import type { StaticImageData } from "next/image";

export const sportIcons: Record<string, StaticImageData> = {
  Badminton,
  Basketball,
  "Cheer Dance": Cheerdance,
  "Contemporary Dance": ContemporaryDance,
  Chess,
  "Esports": Esports,
  "Flag Football": FlagFootball,
  Frisbee,
  Futsal,
  "Lawn Tennis": LawnTennis,
  "Mr. & Ms. USC": MrAndMsUSC,
  Pickleball,
  Soccer,
  Swimming,
  "Table Tennis": TableTennis,
  Volleyball,
  Default: TCRedLogo,
};

// Keep historical game names compatible without duplicating sports in the grid.
export const sportIconAliases: Record<string, string> = {
  Cheerdance: "Cheer Dance",
  "E-Sports": "Esports",
  "Mobile Legends": "Esports",
  Valorant: "Esports",
  Football: "Soccer",
  "3x3 Basketball": "Basketball",
  "Mr. USC Days": "Mr. & Ms. USC",
  "Ms. USC Days": "Mr. & Ms. USC",
};

export const sports = Object.entries(sportIcons)
  .filter(([key]) => key !== "Default")
  .map(([key, icon]) => ({
    id: key.toLowerCase().replace(/\s+/g, "-"),
    name: key,
    icon,
  }));
