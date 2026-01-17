"use client";

import React, { useState } from "react";
import MerchandiseModal from "./merch-modal";

type Product = {
  id: string;
  title: string;
  size: string;
  price: string;
  stock: "In Stock" | "Sold Out";
  image: string;
  description: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "In Stock",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
  {
    id: "2",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "Sold Out",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
  {
    id: "3",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "In Stock",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
  {
    id: "4",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "Sold Out",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
  {
    id: "5",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "In Stock",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
  {
    id: "6",
    title: "Carolinian Coaster",
    size: "2\" x 2\"",
    price: "PHP 20.00",
    stock: "In Stock",
    image: "/images/Icon Logo Red.png",
    description: "Durable coaster featuring the iconic USC Days logo. Perfect for protecting your surfaces while displaying your school spirit.",
  },
];

export default function MerchSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-12 px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-8">Featured Merchandise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="text-left bg-white border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="w-full h-32 object-cover bg-gray-100"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{product.size}</p>
                <p className="text-sm font-medium mb-1">{product.price}</p>
                <p className={`text-xs ${product.stock === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                  {product.stock}
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
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}