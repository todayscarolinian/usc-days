"use client";

import Image from "next/image";
import { schools } from "@/src/constants/schoolLogos";

export default function SchoolsSection() {
  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold mb-8">Schools</h2>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full lg:flex-nowrap">
        {schools
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s) => (
            <figure
              key={s.id}
              className="flex flex-col items-center text-center flex-[0_0_calc(33.333%-1.334rem)] sm:flex-[0_0_calc(25%-1.5rem)] md:flex-[0_0_calc(20%-2.4rem)] lg:flex-[1_1_auto]"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative">
                <Image
                  src={s.icon}
                  alt={`${s.name} icon`}
                  fill
                  sizes="(min-width: 768px) 72px, (min-width: 640px) 64px, 56px"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-2 text-[12px] uppercase tracking-wider text-gray-700">
                {s.name}
              </figcaption>
            </figure>
          ))}
      </div>
    </div>
  );
}
