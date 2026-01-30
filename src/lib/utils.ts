import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { sportIcons } from "../constants/sportIcons";
import { schoolLogos } from "../constants/schoolLogos";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  if (swimmingAliases.some((alias) => name.includes(alias))) {
    return sportIcons["Swimming"];
  }

  const key = Object.keys(sportIcons).find((k) => name.includes(k));

  return key ? sportIcons[key] : sportIcons["Default"];
};

export const getLogoForSchool = (schoolName: string) => {
    const key = Object.keys(schoolLogos).find((k) => schoolName.includes(k));
    return key ? schoolLogos[key] : schoolLogos["Default"];
}