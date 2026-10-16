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
import styles from "./sports-section.module.css";

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
      className={`${roboto.className} ${styles.carousel} w-full bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat text-[#f7f6f6]`}
    >
      <h2 id="sports-heading" className="sr-only">Sports</h2>
      <div className={`${styles.track} py-3 sm:py-6 lg:py-8`}>
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            aria-labelledby={copy === 0 ? "sports-heading" : undefined}
            className="flex shrink-0"
          >
            {sports.map((sport) => (
              <li key={sport.name} className="w-28 shrink-0 px-2 sm:w-40 sm:px-3 lg:w-44">
                <figure className="flex flex-col items-center py-1 text-center sm:py-2">
                  <Image
                    src={sport.icon}
                    alt=""
                    width={64}
                    height={66}
                    sizes="(max-width: 639px) 44px, 64px"
                    className="h-[46px] w-[44px] max-w-full object-contain sm:h-[66px] sm:w-[64px]"
                  />
                  <figcaption className="mt-1.5 min-h-7 text-[10px] leading-[14px] font-normal tracking-[0.05em] uppercase sm:mt-2 sm:min-h-0 sm:text-xs sm:leading-[18px] sm:whitespace-nowrap">
                    {sport.name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
