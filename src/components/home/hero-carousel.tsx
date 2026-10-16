"use client";

import Image from "next/image";
import { useState } from "react";
import { markHeroEntrancePlayed, useHeroEntrancePlayed, useOpeningRevealStarted } from "@/src/hooks/use-opening-screen";
import styles from "./hero-carousel.module.css";
import heroTitleLogo from "@/src/assets/hero-title-logo/usc-days-2026.svg";
import { carouselImages } from "@/src/constants/carouselImages";
import { useSharedCarouselIndex } from "@/src/hooks/use-shared-carousel-index";

const SLIDE_INTERVAL = 5000;

export default function HeroCarousel() {
  const revealStarted = useOpeningRevealStarted();
  const heroPlayed = useHeroEntrancePlayed();
  const [animatingHere, setAnimatingHere] = useState(false);
  const { activeIndex: index, goTo } = useSharedCarouselIndex(
    carouselImages.length,
    SLIDE_INTERVAL,
  );

  return (
    <section
      id="site-hero"
      aria-label="Hero carousel"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {carouselImages.map((image, i) => (
        <Image
          key={i}
          src={image}
          alt={`USC Days carousel slide ${i + 1}`}
          fill
          priority={i === index}
          placeholder="blur"
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
      ))}

      <div className="absolute inset-0 bg-black/35 z-10 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <h1
          data-hero-title
          className={`${styles.title} ${revealStarted ? styles.revealed : ""} relative aspect-[5/1] w-full max-w-6xl overflow-hidden drop-shadow-lg`}
          style={heroPlayed && !animatingHere ? { animation: "none", transform: "none" } : undefined}
          onAnimationStart={() => {
            setAnimatingHere(true);
            markHeroEntrancePlayed();
          }}
        >
          <Image
            src={heroTitleLogo}
            alt="USC Days 2026"
            priority
            sizes="(max-width: 1200px) calc(100vw - 48px), 1152px"
            className="absolute top-1/2 h-auto w-full -translate-y-1/2"
          />
        </h1>
      </div>

      <div className="absolute right-6 bottom-6 z-30 flex gap-2">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
