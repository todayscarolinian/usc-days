"use client";

import React, { useState } from "react";
import Image from "next/image";
import PRODUCTS from "@/src/constants/products.json";
import ProductModal from "@/src/components/merchandise/product-modal";
import Breadcrumb from "@/src/components/merchandise/breadcrumb";

type Product = {
  id: number;
  categoryId: number;
  title: string;
  size: string | null;
  price: number;
  isAvailable: boolean;
  imgUrls: string[];
  designer: string[] | null;
};

interface CategoryProductsClientProps {
  categoryId: number;
  categoryName: string;
}

export default function CategoryProductsClient({
  categoryId,
  categoryName,
}: CategoryProductsClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = PRODUCTS.filter(
    (product) => product.categoryId === categoryId
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
                  src={product.imgUrls[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
                <p className="text-sm font-medium mb-1">PHP {product.price.toFixed(2)}</p>
                <p className={`text-xs ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
                  {product.isAvailable ? "In Stock" : "Sold Out"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}