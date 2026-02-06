"use client";

import Image from "next/image";
import Link from "next/link";
import { getCategoriesQuery } from "@/src/queries/categories.queries";

export default function MerchSection() {
  const { data: categories, isLoading, error } = getCategoriesQuery();

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-tc_primary border border-gray-300 rounded-lg overflow-hidden flex flex-col animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 shrink-0" />
              <div className="p-3">
                <div className="h-6 bg-gray-300 rounded mx-auto w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Failed to load merchandise
          </p>
          <p className="text-red-500 text-sm">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </section>
    );
  }

  // No data state
  if (!categories || categories.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            No merchandise categories available at this time.
          </p>
        </div>
      </section>
    );
    }
    
    console.log("Merchandise Categories:", categories);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/merchandise/${category.categoryName.toLowerCase()}`}
            className="text-left bg-tc_primary border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
          >
            <div className="relative w-full h-48 bg-gray-100 shrink-0">
              <Image
                src={category.imgUrl}
                alt={category.categoryName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-lg text-center text-white">
                {category.categoryName}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
