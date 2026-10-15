import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sportIconAliases, sportIcons } from "../constants/sportIcons";
import { schoolLogos } from "../constants/schoolLogos";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const swimmingAliases = [
  "Freestyle",
  "Backstroke",
  "Butterfly",
  "Breaststroke",
  "Medley",
  "Relay",
];

export const getIconFor = (name: string) => {
  const normalizedName = name.toLowerCase();
  if (swimmingAliases.some((alias) => normalizedName.includes(alias.toLowerCase()))) {
    return sportIcons["Swimming"];
  }

  const key = Object.keys(sportIcons).find((k) =>
    k !== "Default" && normalizedName.includes(k.toLowerCase())
  );

  if (key) return sportIcons[key];

  const alias = Object.keys(sportIconAliases).find((k) =>
    normalizedName.includes(k.toLowerCase())
  );

  return alias ? sportIcons[sportIconAliases[alias]] : sportIcons["Default"];
};

export const getLogoForSchool = (schoolName: string) => {
  const key = Object.keys(schoolLogos).find((k) => schoolName.includes(k));
  return key ? schoolLogos[key] : schoolLogos["Default"];
};
