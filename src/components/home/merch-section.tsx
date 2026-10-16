import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import TCRedLogo from "@/src/assets/tc-logo-red.png";
import PostcardsIcon from "@/src/assets/icons/merch/postcards.svg";
import BookmarksIcon from "@/src/assets/icons/merch/bookmarks.svg";
import StickersIcon from "@/src/assets/icons/merch/stickers.svg";
import LanyardsIcon from "@/src/assets/icons/merch/lanyards.svg";
import PinsIcon from "@/src/assets/icons/merch/pins.svg";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

// `category` must match the category name in the database; `label` is the display text.
const MERCH_CATEGORIES: {
  category: string;
  label: string;
  icon: StaticImageData;
  labelClassName: string;
}[] = [
  { category: "Post Cards", label: "Postcards", icon: PostcardsIcon, labelClassName: "font-medium text-black" },
  { category: "Bookmarks", label: "Bookmarks", icon: BookmarksIcon, labelClassName: "text-black" },
  { category: "Stickers", label: "Stickers", icon: StickersIcon, labelClassName: "text-black" },
  { category: "Lanyards", label: "Lanyards", icon: LanyardsIcon, labelClassName: "text-[red]" },
  { category: "Pins", label: "Pins", icon: PinsIcon, labelClassName: "text-black" },
];

export default function MerchSection() {
  return (
    <div
      className={`${roboto.className} flex flex-col items-center gap-2.5 px-6 py-7 text-center text-black sm:px-12`}
    >
      <Image src={TCRedLogo} alt="Today's Carolinian logo" className="size-[101px]" />

      <p className="text-lg leading-6 font-bold">Support us by buying our merch</p>

      <h2 id="featured-merch-heading" className="text-4xl leading-11 font-bold">
        Grab Your Today&apos;s
        <br />
        Carolinian Merch
      </h2>

      <nav
        aria-label="Merchandise categories"
        className="flex w-full max-w-[569px] flex-wrap items-center justify-center gap-4 p-2.5 sm:flex-nowrap sm:justify-between sm:gap-0"
      >
        {MERCH_CATEGORIES.map(({ category, label, icon, labelClassName }) => (
          <Link
            key={category}
            href={{ pathname: "/merchandise", query: { category } }}
            className="flex h-[87px] w-[84px] flex-col items-center justify-between transition-transform hover:-translate-y-0.5"
          >
            <span className="flex size-[59px] items-center justify-center">
              <Image src={icon} alt="" />
            </span>
            <span className={`text-base leading-6 ${labelClassName}`}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
