"use client";

import { ColumnDef } from "@tanstack/react-table";

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
import Image from "next/image";

export type SportInfo = {
  id: number;
  name: string;
  teams: {
    id: number;
    name: string;
  }[];
};

const sportIcons: Record<string, React.JSX.Element> = {
  Badminton: (
    <Image src={Badminton} className="inline mr-2 size-6" alt="Badminton" />
  ),
  Basketball: (
    <Image src={Basketball} className="inline mr-2 size-6" alt="Basketball" />
  ),
  "Cheer Dance": (
    <Image src={Cheerdance} className="inline mr-2 size-6" alt="Cheer Dance" />
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
  Frisbee: <Image src={Frisbee} className="inline mr-2 size-6" alt="Frisbee" />,
  Futsal: <Image src={Futsal} className="inline mr-2 size-6" alt="Futsal" />,
  "Lawn Tennis": (
    <Image src={LawnTennis} className="inline mr-2 size-6" alt="Lawn Tennis" />
  ),
  "Mr. USC Days": (
    <Image src={MrIntrams} className="inline mr-2 size-6" alt="Mr. USC Days" />
  ),
  "Ms. USC Days": (
    <Image src={MsIntrams} className="inline mr-2 size-6" alt="Ms. USC Days" />
  ),
  Swimming: (
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
    <Image src={Volleyball} className="inline mr-2 size-6" alt="Volleyball" />
  ),
};

export const sportColumns: ColumnDef<SportInfo>[] = [
  {
    accessorKey: "name",
    cell: (info) => {
      const sport = info.getValue<string>();

      // Find a matching sport key that is contained within the sport name
      const matchingSportKey = Object.keys(sportIcons).find((key) =>
        sport.includes(key)
      );

      const Icon = matchingSportKey ? sportIcons[matchingSportKey] : null; // Retrieve the icon from the mapping
      return (
        <div className="flex items-center">
          {Icon}
          <span>{sport}</span>
        </div>
      );
    },
    header: "Name",
  },
  {
    accessorKey: "teams",
    accessorFn: (row) => row.teams.map((team) => team.name).join(", "),
    cell: (info) => {
      const teamData = info.getValue<string>();

      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {teamData?.split(", ").map((team) => {
            return (
              <div
                key={team}
                className="flex justify-center items-center py-1 px-4 rounded-full bg-tc_primary text-white"
              >
                <span className="font-bold text-center">{team}</span>
              </div>
            );
          })}
        </div>
      );
    },
    header: "Teams",
  },
];
