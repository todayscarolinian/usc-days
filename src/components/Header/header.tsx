import Image from "next/image";
import tclogored from "../../../public/images/Icon Logo Red.png"

const Header = () => {
  return (
    <div className="bg-background-red flex justify-between items-center p-2 text-white font-semibold">
      <h1 className="uppercase text-white font-bold text-4xl px-4">
        <Image src={tclogored} alt="tc-logo-red" width={56} />
      </h1>
      <h2 className="uppercase text-3xl font-bold px-4">USC Days 2024</h2>
    </div>
  )
}

export default Header;