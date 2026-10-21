import Image from "next/image";
import BronzeMedal from "@/src/assets/medals/bronze-medal.png";
import GoldMedal from "@/src/assets/medals/gold-medal.png";
import SilverMedal from "@/src/assets/medals/silver-medal.png";
import { cn } from "@/src/lib/utils";

const MEDALS: Record<number, typeof GoldMedal> = {
  1: GoldMedal,
  2: SilverMedal,
  3: BronzeMedal,
};

/** Gold, silver, or bronze for ranks 1–3; an empty slot of the same size otherwise. */
export default function PlacingMedal({ rank, className }: { rank: number | null; className?: string }) {
  const medal = rank != null ? MEDALS[rank] : undefined;
  if (!medal) return <span aria-hidden="true" className={cn("size-6 shrink-0", className)} />;
  return <Image src={medal} alt="" width={24} height={24} className={cn("size-6 shrink-0 object-contain", className)} />;
}
