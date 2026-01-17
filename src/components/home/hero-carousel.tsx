"use client";

import { useEffect, useState } from "react";

const DEFAULT_MEDIA = [
  { src: "/carousel/bball.jpg", alt: "USC Days highlight 1" },
  { src: "/carousel/flag.jpg", alt: "USC Days highlight 2" },
  { src: "/carousel/table-tennis.jpg", alt: "USC Days highlight 3" },
  { src: "/carousel/vball.jpg", alt: "USC Days highlight 4" },
];

export default function HeroSlideshow({ media = DEFAULT_MEDIA }: { media?: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % media.length), 5000);
    return () => clearInterval(t);
  }, [media.length]);

  return (
    <section
      id="site-hero"
      aria-label="Hero carousel"
      className="relative w-full h-[90vh] overflow-hidden bg-black"
    >
      {media.map((m, i) => (
        <img
          key={m.src}
          src={m.src}
          alt={m.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"}`}
        />
      ))}
s
      <div className="absolute inset-0 bg-black/35 z-30 pointer-events-none" />

      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-6xl md:text-[8rem] font-extrabold leading-none drop-shadow-lg">
          USC <span className="block">DAYS</span>
        </h1>
        <p className="mt-4 text-white/90 max-w-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <nav className="absolute right-6 bottom-6 z-50 flex gap-2" aria-hidden>
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </nav>
    </section>
  );
}