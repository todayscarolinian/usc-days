"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { carouselImages } from "@/src/constants/carouselImages";

const SLIDE_INTERVAL = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % carouselImages.length), SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="site-hero"
      aria-label="Hero carousel"
      className="relative w-full h-[90vh] overflow-hidden bg-black"
    >
      {carouselImages.map((image, i) => (
        <Image
          key={i}
          src={image}
          alt={`USC Days carousel slide ${i + 1}`}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
      ))}

      <div className="absolute inset-0 bg-black/35 z-10 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-6xl md:text-[8rem] font-extrabold leading-none drop-shadow-lg">
          USC <span className="block">DAYS</span>
        </h1>
        <p className="mt-4 text-white/90 max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> {/* TODO: Replace with actual tagline */} 
      </div>

      <div className="absolute right-6 bottom-6 z-30 flex gap-2">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}