"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const images = product.imgUrls;
  const THUMBNAIL_COUNT = 3;

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    
    if (newIndex >= thumbnailStartIndex + THUMBNAIL_COUNT) {
      setThumbnailStartIndex(newIndex - THUMBNAIL_COUNT + 1);
    } else if (newIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(newIndex);
    }
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    
    if (newIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(newIndex);
    } else if (newIndex >= thumbnailStartIndex + THUMBNAIL_COUNT) {
      setThumbnailStartIndex(newIndex - THUMBNAIL_COUNT + 1);
    }
  };

  const visibleThumbnails = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + THUMBNAIL_COUNT
  );

  const currentDesigner = product.designer 
  ? product.designer.join("\n")
  : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent showCloseButton={true} className="sm:max-w-[560px] pt-12 pb-8 bg-white rounded-lg">
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
          <div className="flex gap-6">
            <DialogTitle className="sr-only">{product.title}</DialogTitle>
            {/* Left: Image */}
            <div className="flex-shrink-0 flex flex-col gap-3">
              {/* Main Image */}
              <div className="relative w-[225px] aspect-square bg-gray-100 rounded-lg overflow-hidden"> 
                <Image
                  src={images[currentImageIndex]}
                  alt={product.title}
                  fill
                  sizes="225px"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={prevImage}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex gap-2">
                    {visibleThumbnails.map((img, idx) => (
                      <button
                        key={thumbnailStartIndex + idx}
                        onClick={() => setCurrentImageIndex(thumbnailStartIndex + idx)}
                        className={`relative flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                          currentImageIndex === thumbnailStartIndex + idx
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        aria-label={`View image ${thumbnailStartIndex + idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${thumbnailStartIndex + idx + 1}`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextImage}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Details and Credits */}
            <div className="flex-1 flex flex-col">
              {/* Product Details */}
              <div className="mb-5">
                <h2 className="text-xl font-bold mb-2">{product.title}</h2>
                {product.size && <p className="text-sm text-gray-600 mb-3">{product.size}</p>}
                <p className="text-xl font-semibold mb-2">PHP {product.price.toFixed(2)}</p>
                <p
                  className={`text-sm font-medium ${
                    product.isAvailable
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Sold Out"}
                </p>
              </div>

              {/* Illustration / Design By */}
              {currentDesigner && (
                <div className="mb-6 flex-1">
                  <h3 className="text-sm font-semibold">Illustration / Design By</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {currentDesigner}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Form Button */}
          <div className="flex justify-end">
            <Button
              disabled
              className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg cursor-not-allowed opacity-50"
              title="Order form integration coming soon"
            >
              Order Form (Coming Soon)
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}