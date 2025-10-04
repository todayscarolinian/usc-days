import TCRedLogo from "@/assets/tc-logo-red.png";
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
  "Mr. USC Days": MrIntrams,
  "Ms. USC Days": MsIntrams,
  Swimming,
  "Table Tennis": TableTennis,
  "3x3 Basketball": ThreeByThreeBasketball,
  Volleyball,
  Default: TCRedLogo,
};