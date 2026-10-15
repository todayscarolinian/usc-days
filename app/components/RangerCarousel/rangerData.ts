/**
 * Central place for all Ranger data and image paths.
 **/

import type { StaticImageData } from "next/image";

import SAFADCard from "@/src/assets/rangers/cards/SAFAD.webp";
import SASCard from "@/src/assets/rangers/cards/SAS.webp";
import SBECard from "@/src/assets/rangers/cards/SBE.webp";
import SEDCard from "@/src/assets/rangers/cards/SED.webp";
import SHCPCard from "@/src/assets/rangers/cards/SHCP.webp";
import SLGCard from "@/src/assets/rangers/cards/SLG.webp";
import SOECard from "@/src/assets/rangers/cards/SOE.webp";
import SAFADIcon from "@/src/assets/rangers/icons/SAFAD.png";
import SASIcon from "@/src/assets/rangers/icons/SAS.png";
import SBEIcon from "@/src/assets/rangers/icons/SBE.png";
import SEDIcon from "@/src/assets/rangers/icons/SED.png";
import SHCPIcon from "@/src/assets/rangers/icons/SHCP.png";
import SLGIcon from "@/src/assets/rangers/icons/SLG.png";
import SOEIcon from "@/src/assets/rangers/icons/SOE.png";

export interface Ranger {
  id: string;
  name: string;
  /** Brand color: used for the button background and card fallback */
  color: string;
  /** Full card artwork */
  cardImage: StaticImageData;
  /** Helmet icon shown on the selector button */
  iconImage: StaticImageData;
}

/** Deck order: index 0 is the front card. */
export const RANGERS: Ranger[] = [
  { id: "purple", name: "SHCP",  color: "#5b17b8", cardImage: SHCPCard,   iconImage: SHCPIcon },
  { id: "blue",   name: "SED",   color: "#3b82c0", cardImage: SEDCard,    iconImage: SEDIcon },
  { id: "yellow", name: "SOE",   color: "#d6b633", cardImage: SOECard,    iconImage: SOEIcon },
  { id: "black",  name: "SLG",   color: "#3a3a3a", cardImage: SLGCard,    iconImage: SLGIcon },
  { id: "red",    name: "SAFAD", color: "#b80000", cardImage: SAFADCard,  iconImage: SAFADIcon },
  { id: "navy",   name: "SAS",   color: "#1f3a9e", cardImage: SASCard,    iconImage: SASIcon },
  { id: "green",  name: "SBE",   color: "#2fa516", cardImage: SBECard,    iconImage: SBEIcon },
];

/** Card artwork aspect ratio (reference: 842 x 542). */
export const CARD_ASPECT = "842 / 542";
