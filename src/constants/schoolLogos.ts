import TCRedLogo from "@/src/assets/tc-logo-red.png";

import SAFAD from "@/src/assets/school-logos/SAFAD.png";
import SAS from "@/src/assets/school-logos/SAS.png";
import SBE from "@/src/assets/school-logos/SBE.png";
import SED from "@/src/assets/school-logos/SED.png";
import SHCP from "@/src/assets/school-logos/SHCP.png";
import SLG from "@/src/assets/school-logos/SLG.png";
import SOE from "@/src/assets/school-logos/SOE.png";

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
