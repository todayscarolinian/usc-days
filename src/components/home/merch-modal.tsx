"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

type Product = {
  id: string;
  title: string;
  size: string;
  price: string;
  stock: "In Stock" | "Sold Out";
  image: string;
  description: string;
};

interface MerchandiseModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function MerchandiseModal({
  product,
  isOpen,
  onClose,
}: MerchandiseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent showCloseButton={true} className="max-w-2xl p-10 bg-white rounded-lg">
          <div className="flex gap-6">
            {/* Left: Image */}
            <div className="flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-48 h-48 object-cover rounded-lg bg-gray-100"
              />
            </div>

            {/* Right: Details and Description */}
            <div className="flex-1 flex flex-col">

              {/* Product Details */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-3">{product.size}</p>
                <p className="text-xl font-semibold mb-2">{product.price}</p>
                <p
                  className={`text-sm font-medium ${
                    product.stock === "In Stock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stock}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6 flex-1">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Order Form Button */}
          <div className="flex justify-end">
            <Button
                className="w-full md:w-auto bg-tc_primary text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => {
                    window.open("#", "_blank");
                    onClose();
                }}
                >
                Order Form
            </Button>
          </div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}