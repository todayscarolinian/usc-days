"use client";

import Image, { type StaticImageData } from "next/image";
import { useSharedCarouselIndex } from "@/src/hooks/use-shared-carousel-index";

type PageHeroImage = {
    src: StaticImageData;
    position?: string;
};

type PageHeroProps = {
    title: string;
    eyebrow?: string;
    images?: PageHeroImage[];
    imagePosition?: string;
    interval?: number;
};

export default function PageHero({
    title,
    eyebrow,
    images = [],
    imagePosition = "center",
    interval = 5000,
}: PageHeroProps) {
    const { activeIndex } = useSharedCarouselIndex(images.length, interval);

    return (
        <section
            id="page-hero"
            className="relative flex min-h-64 items-end overflow-hidden bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 sm:min-h-80 lg:min-h-96"
        >
            {images.map((image, index) => (
                <Image
                    key={image.src.src}
                    src={image.src}
                    alt=""
                    aria-hidden="true"
                    fill
                    priority={index === activeIndex}
                    placeholder="blur"
                    sizes="100vw"
                    style={{ objectPosition: image.position ?? imagePosition }}
                    className={`object-cover transition-opacity duration-700 ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            <div className="absolute inset-0 z-10 bg-black/50" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            <div className="relative z-20 mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 sm:pb-12">
                {eyebrow && (
                    <p className="mb-1 text-xs font-normal uppercase tracking-[0.18em] text-white/85 sm:text-sm">
                        {eyebrow}
                    </p>
                )}

                <h1 className="text-5xl font-semibold uppercase italic leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
                    {title}
                </h1>
            </div>
        </section>
    );
}