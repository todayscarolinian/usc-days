import Image from "next/image";
import { Roboto } from "next/font/google";
import Basketball from "@/src/assets/icons/light-gray/basketball.png";
import Volleyball from "@/src/assets/icons/light-gray/volleyball.png";
import Cheer from "@/src/assets/icons/light-gray/cheer.png";
import Contemporary from "@/src/assets/icons/light-gray/contemporary.png";
import MrAndMsUSCDays from "@/src/assets/icons/light-gray/mr-and-ms-usc-days.png";
import FlagFootball from "@/src/assets/icons/light-gray/flag-football.png";
import Football from "@/src/assets/icons/light-gray/football.png";
import Futsal from "@/src/assets/icons/light-gray/futsal.png";
import TableTennis from "@/src/assets/icons/light-gray/table-tennis.png";
import LawnTennis from "@/src/assets/icons/light-gray/lawn-tennis.png";
import Badminton from "@/src/assets/icons/light-gray/badminton.png";
import Swimming from "@/src/assets/icons/light-gray/swimming.png";
import Chess from "@/src/assets/icons/light-gray/chess.png";
import Esports from "@/src/assets/icons/light-gray/esports.png";
import Pickleball from "@/src/assets/icons/light-gray/pickleball.png";
import Frisbee from "@/src/assets/icons/light-gray/frisbee.png";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

const sports = [
  { name: "Basketball", icon: Basketball },
  { name: "Volleyball", icon: Volleyball },
  { name: "Cheer", icon: Cheer },
  { name: "Contemporary", icon: Contemporary },
  { name: "Mr. & Ms. USC Days", icon: MrAndMsUSCDays },
  { name: "Flag Football", icon: FlagFootball },
  { name: "Football", icon: Football },
  { name: "Futsal", icon: Futsal },
  { name: "Table Tennis", icon: TableTennis },
  { name: "Lawn Tennis", icon: LawnTennis },
  { name: "Badminton", icon: Badminton },
  { name: "Swimming", icon: Swimming },
  { name: "Chess", icon: Chess },
  { name: "Esports", icon: Esports },
  { name: "Pickleball", icon: Pickleball },
  { name: "Frisbee", icon: Frisbee },
];

export default function SportsSection() {
  return (
    <div
      className={`${roboto.className} @container w-full bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat text-[#f7f6f6]`}
    >
      <h2 className="sr-only">Sports</h2>
      <ul className="mx-auto grid max-w-[1718px] grid-cols-2 justify-between gap-x-4 gap-y-6 px-4 py-12 @lg:grid-cols-4 @lg:px-8 @lg:py-16 @5xl:grid-cols-[repeat(8,6.25rem)] @5xl:px-12 @5xl:py-20 @7xl:px-20 @7xl:py-25">
        {sports.map((sport) => (
          <li key={sport.name} className="min-w-0">
            <figure className="flex flex-col items-center py-2.5 text-center">
              <Image
                src={sport.icon}
                alt=""
                width={100}
                height={103}
                sizes="100px"
                className="h-[103px] w-[100px] max-w-full object-contain"
              />
              <figcaption className="mt-2 text-xs leading-[18px] font-normal tracking-[0.05em] uppercase @5xl:whitespace-nowrap">
                {sport.name}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
