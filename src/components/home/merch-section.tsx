"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CATEGORIES from "@/src/constants/categories.json";
import Image from "next/image";
import MerchSectionSkeleton from "./merch-section-skeleton";

type Category = { id: number; name: string; imgUrl: string };

export default function MerchSection() {
  const router = useRouter();
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
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/merchandise/${categoryId}`);
  };

  if (!inView) {
    return (
      <div ref={sectionRef}>
        <MerchSectionSkeleton />
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="text-left bg-tc_primary border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
          >
            <div className="relative w-full h-48 bg-gray-100 flex-shrink-0">
              <Image
                src={category.imgUrl}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-lg text-center text-white">
                {category.name}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}