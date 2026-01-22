import TCRedLogo from "@/src/assets/tc-logo-red.png";
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
import type { StaticImageData } from "next/image";

export const sportIcons: Record<string, StaticImageData> = {
  Badminton,
  Basketball,
  "Cheer Dance": Cheerdance,
  Chess,
  "E-Sports": Esports,
  "Flag Football": FlagFootball,
  Football,
  Frisbee,
  Futsal,
  "Lawn Tennis": LawnTennis,
  "Mr. USC \nIntramurals": MrIntrams,
  "Ms. USC \nIntramurals": MsIntrams,
  Swimming,
  "Table Tennis": TableTennis,
  "3x3 Basketball": ThreeByThreeBasketball,
  Volleyball,
  Default: TCRedLogo,
};

export const sports = Object.entries(sportIcons)
  .filter(([key]) => key !== "Default")
  .map(([key, icon]) => ({
    id: key.toLowerCase().replace(/\s+/g, "-"),
    name: key,
    icon,
  }));
