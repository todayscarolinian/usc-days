import Badminton from "@/assets/icons/Diamond/Badminton.svg";
import Basketball from "@/assets/icons/Diamond/Basketball.svg";
import Cheerdance from "@/assets/icons/Diamond/Cheerdance.svg";
import Chess from "@/assets/icons/Diamond/Chess.svg";
import Esports from "@/assets/icons/Diamond/Esports.svg";
import FlagFootball from "@/assets/icons/Diamond/Flag Football.svg";
import Football from "@/assets/icons/Diamond/Football.svg";
import Frisbee from "@/assets/icons/Diamond/Frisbee.svg";
import Futsal from "@/assets/icons/Diamond/Futsal.svg";
import LawnTennis from "@/assets/icons/Diamond/Lawn Tennis.svg";
import MrIntrams from "@/assets/icons/Diamond/Mr Intrams.svg";
import MsIntrams from "@/assets/icons/Diamond/Ms Intrams.svg";
import Swimming from "@/assets/icons/Diamond/Swimming.svg";
import TableTennis from "@/assets/icons/Diamond/Table Tennis.svg";
import ThreeByThreeBasketball from "@/assets/icons/Diamond/ThreeByThreeBasketball.svg";
import Volleyball from "@/assets/icons/Diamond/Volleyball.svg";
import Image from "next/image";

export const sportIcons: Record<string, React.JSX.Element> = {
  Badminton: (
    <Image src={Badminton} className="inline mr-2 size-6" alt="Badminton" />
  ),
  Basketball: (
    <Image src={Basketball} className="inline mr-2 size-6" alt="Basketball" />
  ),
  "Cheer Dance": (
    <Image src={Cheerdance} className="inline mr-2 size-6" alt="Cheer Dance" />
  ),
  Chess: <Image src={Chess} className="inline mr-2 size-6" alt="Chess" />,
  "E-Sports": (
    <Image src={Esports} className="inline mr-2 size-6" alt="Esports" />
  ),
  "Flag Football": (
    <Image
      src={FlagFootball}
      className="inline mr-2 size-6"
      alt="Flag Football"
    />
  ),
  Football: (
    <Image src={Football} className="inline mr-2 size-6" alt="Football" />
  ),
  Frisbee: <Image src={Frisbee} className="inline mr-2 size-6" alt="Frisbee" />,
  Futsal: <Image src={Futsal} className="inline mr-2 size-6" alt="Futsal" />,
  "Lawn Tennis": (
    <Image src={LawnTennis} className="inline mr-2 size-6" alt="Lawn Tennis" />
  ),
  "Mr. USC Days": (
    <Image src={MrIntrams} className="inline mr-2 size-6" alt="Mr. USC Days" />
  ),
  "Ms. USC Days": (
    <Image src={MsIntrams} className="inline mr-2 size-6" alt="Ms. USC Days" />
  ),
  Swimming: (
    <Image src={Swimming} className="inline mr-2 size-6" alt="Swimming" />
  ),
  "Table Tennis": (
    <Image
      src={TableTennis}
      className="inline mr-2 size-6"
      alt="Table Tennis"
    />
  ),
  "3x3 Basketball": (
    <Image
      src={ThreeByThreeBasketball}
      className="inline mr-2 size-6"
      alt={"3x3 Basketball"}
    />
  ),
  Volleyball: (
    <Image src={Volleyball} className="inline mr-2 size-6" alt="Volleyball" />
  ),
  Default: (
      <Image src="/tc-logo-red.png" width={24} height={24} className="inline mr-2" alt="Sport" />
  ),
};