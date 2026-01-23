"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sports } from "@/src/constants/sportIcons";
import SportsSectionSkeleton from "./sports-section-skeleton";

export default function SportsSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.8 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!inView) {
    return (
      <div ref={sectionRef}>
        <SportsSectionSkeleton />
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="w-full py-8">
      <h2 className="text-3xl font-bold mb-8">Sports</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8 md:gap-12 w-full">
        {sports.map((s) => (
          <figure key={s.id} className="flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative">
              <Image
                src={s.icon}
                alt={`${s.name} icon`}
                fill
                sizes="(min-width: 768px) 72px, (min-width: 640px) 64px, 56px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-2 text-[12px] uppercase tracking-wider text-gray-700 whitespace-pre-line">
              {s.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}