"use client";

import Image from "next/image";
import { sportIcons } from "@/src/constants/sportIcons";

type Sport = { id: string; name: string; icon?: string | { src?: string } };

// build a list from the sportIcons record; tweak order if needed
const SPORTS = Object.keys(sportIcons)
  .filter((k) => k !== "Default")
  .map((k) => ({
  id: k.toLowerCase().replace(/\s+/g, "-"),
  name: k,
  icon: (sportIcons as Record<string, any>)[k],
}));

export default function SportsSection() {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-8">Sports</h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-4 items-center px-1">
          {SPORTS.map((s) => {
            const icon = s.icon as any;
            // support next/image StaticImageData or string path
            const src = typeof icon === "string" ? icon : icon?.src ?? "/icons/sports/default.svg";

            return (
              <figure key={s.id} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 relative">
                  <Image
                    src={src}
                    alt={`${s.name} icon`}
                    fill
                    sizes="48px"
                    className="object-contain"
                    unoptimized={false}
                  />
                </div>
                <figcaption className="mt-2 text-[10px] md:text-xs uppercase tracking-wider text-gray-700">
                  {s.name}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}