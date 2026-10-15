import TCRedLogo from "@/src/assets/tc-logo-red.png";

import SAFAD from "@/src/assets/school-logos/SAFAD-head.png";
import SAS from "@/src/assets/school-logos/SAS-head.png";
import SBE from "@/src/assets/school-logos/SBE-head.png";
import SED from "@/src/assets/school-logos/SED-head.png";
import SHCP from "@/src/assets/school-logos/SHCP-head.png";
import SLG from "@/src/assets/school-logos/SLG-head.png";
import SOE from "@/src/assets/school-logos/SOE-head.png";

import type { StaticImageData } from "next/image";

export const schoolLogos: Record<string, StaticImageData> = {
  SAFAD,
  SAS,
  SBE,
  SED,
  SHCP,
  SLG,
  SOE,
  Default: TCRedLogo,
};

export const schools = Object.entries(schoolLogos)
  .filter(([key]) => key !== "Default")
  .map(([key, icon]) => ({
    id: key.toLowerCase().replace(/\s+/g, "-"),
    name: key,
    icon,
  }));
