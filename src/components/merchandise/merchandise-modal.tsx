"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { MerchandiseProduct } from "@/src/lib/prisma/generated/client";

interface Product extends Omit<MerchandiseProduct, "imgUrls, designers"> {
  imgUrls: string[];
  designers: string[];
}

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
    thumbnailStartIndex + THUMBNAIL_COUNT,
  );

  const currentDesigner = product.designers
    ? product.designers.join("\n")
    : null;

  useEffect(() => {
    setCurrentImageIndex(0);
    setThumbnailStartIndex(0);
  }, [product.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          showCloseButton={true}
          className="sm:max-w-140 pt-12 pb-8 bg-white rounded-lg"
        >
          <DialogTitle className="sr-only">{product.productTitle}</DialogTitle>
          <div className="flex gap-6">
            <DialogTitle className="sr-only">
              {product.productTitle}
            </DialogTitle>
            {/* Left: Image */}
            <div className="shrink-0 flex flex-col gap-3">
              {/* Main Image */}
              <div className="relative w-[225px] aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.productTitle}
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
                        onClick={() =>
                          setCurrentImageIndex(thumbnailStartIndex + idx)
                        }
                        className={`relative flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                          currentImageIndex === thumbnailStartIndex + idx
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        aria-label={`View image ${thumbnailStartIndex + idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.productTitle} ${thumbnailStartIndex + idx + 1}`}
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
                <h2 className="text-xl font-bold mb-2">
                  {product.productTitle}
                </h2>
                {product.productSize && (
                  <p className="text-sm text-gray-600 mb-3">
                    {product.productSize}
                  </p>
                )}
                <p className="text-xl font-semibold mb-2">
                  PHP {Number(product.productPrice).toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    product.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Sold Out"}
                </p>
              </div>

              {/* Illustration / Design By */}
              {currentDesigner && (
                <div className="mb-6 flex-1">
                  <h3 className="text-sm font-semibold">
                    Illustration / Design By
                  </h3>
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
              className={`bg-tc_primary text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity ${!product.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!product.isAvailable}
              onClick={() => {
                const formUrl = new URL(
                  "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",
                ); // fields depend on form
                formUrl.searchParams.append(
                  "entry.FIELD_ID_1",
                  product.productTitle,
                );
                formUrl.searchParams.append(
                  "entry.FIELD_ID_2",
                  `PHP ${Number(product.productPrice).toFixed(2)}`,
                );
                // Add more fields as needed

                window.open(formUrl.toString(), "_blank");
                onClose();
              }}
            >
              {product.isAvailable ? "Order Form" : "Sold Out"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
