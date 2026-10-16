"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function MatchdayBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;

    function updatePosition() {
      frame = null;
      if (!section || !image) return;

      if (reducedMotion.matches) {
        image.style.transform = "";
        return;
      }

      const { top, height } = section.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (window.innerHeight - top) / (window.innerHeight + height)),
      );
      const offset = (progress - 0.5) * height * 0.4;
      image.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updatePosition);
    }

    updatePosition();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="matchday-banner-heading"
      className="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden bg-neutral-950 px-6 py-12 text-center text-white sm:min-h-[360px] lg:min-h-[440px]"
    >
      <div
        ref={imageRef}
        aria-hidden="true"
        className="absolute -inset-y-[20%] inset-x-0 motion-safe:will-change-transform"
      >
        <Image
          src="/standings/placeholder.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <h2
        id="matchday-banner-heading"
        className="relative text-5xl leading-tight font-extrabold tracking-tight uppercase sm:text-7xl lg:text-9xl"
      >
        Catch Every Moment
      </h2>
    </section>
  );
}
