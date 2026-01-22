import Image from "next/image";
import { sports } from "@/src/constants/sportIcons";

export default function SportsSection() {
  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold mb-8">Sports</h2>
      <div className="flex flex-wrap justify-center gap-12 items-center">
        {sports.map((s) => (
          <figure key={s.id} className="flex flex-col items-center text-center">
            <div className="w-15 h-15 sm:w-18 sm:h-18 md:w-22 md:h-22 relative">
              <Image
                src={s.icon}
                alt={`${s.name} icon`}
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-2 text-[12px] md:text-sm uppercase tracking-wider text-gray-700 whitespace-pre-line">
              {s.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}