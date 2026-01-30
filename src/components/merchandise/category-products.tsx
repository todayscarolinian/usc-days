"use client";

import { useState } from "react";
import Image from "next/image";
import MerchandiseModal from "@/src/components/merchandise/merchandise-modal";
import Breadcrumb from "@/src/components/merchandise/breadcrumb";
import { getProductsQuery } from "@/src/queries/product.queries";
import type { MerchandiseProduct } from "@/src/lib/prisma/generated/client";

interface CategoryProductsClientProps {
  categoryId: number;
  categoryName: string;
}

interface Product extends Omit<MerchandiseProduct, "imgUrls, designers"> {
  imgUrls: string[];
  designers: string[];
}

export default function CategoryProductsClient({
  categoryId,
  categoryName,
}: CategoryProductsClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const { data = [], error, isLoading } = getProductsQuery();

  const filteredProducts = (data as unknown as Product[]).filter(
    (product) => product.categoryId === categoryId,
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-12 px-6 pt-20">
        <Breadcrumb categoryName={categoryName} />
        <h2 className="text-3xl font-bold mb-8">{categoryName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col animate-pulse"
            >
              <div className="w-full h-32 bg-gray-200" />
              <div className="p-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
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
      <section className="py-12 px-6 pt-20">
        <Breadcrumb categoryName={categoryName} />
        <h2 className="text-3xl font-bold mb-8">{categoryName}sadasds</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">
            Failed to load products
          </p>
          <p className="text-red-500 text-sm">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <section className="py-12 px-6 pt-20">
        <Breadcrumb categoryName={categoryName} />
        <h2 className="text-3xl font-bold mb-8">{categoryName}</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No products found in this category.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 px-6 pt-20">
        <Breadcrumb categoryName={categoryName} />
        <h2 className="text-3xl font-bold mb-8">{categoryName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="text-left bg-white border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-32 bg-gray-100 flex-shrink-0">
                <Image
                  src={product.imgUrls[0] || "/placeholder.png"}
                  alt={product.productTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">
                  {product.productTitle}
                </h3>
                <p className="text-sm font-medium mb-1">
                  PHP {Number(product.productPrice).toFixed(2)}
                </p>
                <p
                  className={`text-xs ${product.isAvailable ? "text-green-600" : "text-red-600"}`}
                >
                  {product.isAvailable ? "In Stock" : "Sold Out"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <MerchandiseModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}
