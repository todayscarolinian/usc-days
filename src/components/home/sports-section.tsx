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
import styles from "./sports-section.module.css";

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
      className={`${roboto.className} ${styles.carousel} w-full bg-neutral-950 bg-[url('/black-bg.png')] bg-top bg-repeat text-[#f7f6f6]`}
    >
      <h2 id="sports-heading" className="sr-only">Sports</h2>
      <div className={`${styles.track} py-6 lg:py-8`}>
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            aria-labelledby={copy === 0 ? "sports-heading" : undefined}
            className="flex shrink-0"
          >
            {sports.map((sport) => (
              <li key={sport.name} className="w-40 shrink-0 px-3 lg:w-44">
                <figure className="flex flex-col items-center py-2 text-center">
                  <Image
                    src={sport.icon}
                    alt=""
                    width={64}
                    height={66}
                    sizes="64px"
                    className="h-[66px] w-[64px] max-w-full object-contain"
                  />
                  <figcaption className="mt-2 text-xs leading-[18px] font-normal tracking-[0.05em] whitespace-nowrap uppercase">
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
