import Image from "next/image";
import Link from "next/link";
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
  { name: "Basketball", href: `/schedules?event=${encodeURIComponent("Basketball")}`, icon: Basketball },
  { name: "Volleyball", href: `/schedules?event=${encodeURIComponent("Volleyball")}`, icon: Volleyball },
  { name: "Cheer", href: `/schedules?event=${encodeURIComponent("Cheer Dance")}`, icon: Cheer },
  { name: "Contemporary", href: `/schedules?event=${encodeURIComponent("Contemporary Dance")}`, icon: Contemporary },
  { name: "Mr. & Ms. USC Days", href: `/schedules?event=${encodeURIComponent("Mr. & Ms. USC")}`, icon: MrAndMsUSCDays },
  { name: "Flag Football", href: `/schedules?event=${encodeURIComponent("Flag Football")}`, icon: FlagFootball },
  { name: "Football", href: `/schedules?event=${encodeURIComponent("Soccer")}`, icon: Football },
  { name: "Futsal", href: `/schedules?event=${encodeURIComponent("Futsal")}`, icon: Futsal },
  { name: "Table Tennis", href: `/schedules?event=${encodeURIComponent("Table Tennis")}`, icon: TableTennis },
  { name: "Lawn Tennis", href: `/schedules?event=${encodeURIComponent("Lawn Tennis")}`, icon: LawnTennis },
  { name: "Badminton", href: `/schedules?event=${encodeURIComponent("Badminton")}`, icon: Badminton },
  { name: "Swimming", href: `/schedules?event=${encodeURIComponent("Swimming")}`, icon: Swimming },
  { name: "Chess", href: `/schedules?event=${encodeURIComponent("Chess")}`, icon: Chess },
  { name: "Esports", href: `/schedules?event=${encodeURIComponent("Esports")}`, icon: Esports },
  { name: "Pickleball", href: `/schedules?event=${encodeURIComponent("Pickleball")}`, icon: Pickleball },
  { name: "Frisbee", href: `/schedules?event=${encodeURIComponent("Frisbee")}`, icon: Frisbee },
];

export default function SportsSection() {
  return (
    <div
      className={`${roboto.className} @container w-full bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat text-[#f7f6f6]`}
    >
      <h2 id="sports-heading" className="sr-only">Sports</h2>
      <ul className="mx-auto grid max-w-[1718px] grid-cols-2 justify-between gap-x-4 gap-y-6 px-4 py-8 @lg:grid-cols-4 @lg:px-8 @lg:py-10 @5xl:grid-cols-[repeat(8,6.25rem)] @5xl:px-12 @5xl:py-12 @7xl:px-20 @7xl:py-12">
        {sports.map((sport) => {
          const content = (
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
          );

          return (
            <li key={sport.name} className="min-w-0">
              {sport.href ? (
                <Link
                  href={sport.href}
                  className="block cursor-pointer transition-opacity hover:opacity-80 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {content}
                </Link>
              ) : content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
