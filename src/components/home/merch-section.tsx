"use client";

import CATEGORIES from "@/src/constants/categories.json";
import Image from "next/image";
import Link from "next/link";

export default function MerchSection() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/merchandise/${category.id}`}
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
          </Link>
        ))}
      </div>
    </section>
  );
}