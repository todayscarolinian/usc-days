/**
 * Central place for all Ranger data and image paths.
 *
 * TO REPLACE IMAGES:
 * - Put your files in public/rangers/
 * - Edit only the cardImage / iconImage filenames in the RANGERS array.
 */

const IMAGE_BASE = "/rangers";

const img = (filename: string) => `${IMAGE_BASE}/${filename}`;

export interface Ranger {
  id: string;
  name: string;
  /** Brand color: used for the button background and card fallback */
  color: string;
  /** Full card artwork */
  cardImage: string;
  /** Helmet icon shown on the selector button */
  iconImage: string;
}

/** Deck order: index 0 is the front card. */
export const RANGERS: Ranger[] = [
  { id: "purple", name: "SHCP",  color: "#5b17b8", cardImage: img("SHCP_card.svg"),  iconImage: img("SHCP_ranger.png") },
  { id: "blue",   name: "SED",   color: "#3b82c0", cardImage: img("SED_card.png"),    iconImage: img("SED_ranger.png") },
  { id: "yellow", name: "SOE",   color: "#d6b633", cardImage: img("SOE_card.png"),    iconImage: img("SOE_ranger.png") },
  { id: "black",  name: "SLG",   color: "#3a3a3a", cardImage: img("SLG_card.svg"),    iconImage: img("SLG_ranger.png") },
  { id: "red",    name: "SAFAD", color: "#b80000", cardImage: img("SAFAD_card.svg"),  iconImage: img("SAFAD_ranger.png") },
  { id: "navy",   name: "SAS",   color: "#1f3a9e", cardImage: img("SAS_card.png"),    iconImage: img("SAS_ranger.png") },
  { id: "green",  name: "SBE",   color: "#2fa516", cardImage: img("SBE_card.svg"),    iconImage: img("SBE_ranger.png") },
];

/** Card artwork aspect ratio (reference: 842 x 542). */
export const CARD_ASPECT = "842 / 542";