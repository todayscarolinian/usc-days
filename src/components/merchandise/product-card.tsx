"use client";

import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });

interface ProductCardProps {
  title: string;
  price: number | string;
  imgUrl?: string;
  isAvailable: boolean;
  onClick?: () => void;
}

export default function ProductCard({
  title,
  price,
  imgUrl,
  isAvailable,
  onClick,
}: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${roboto.className} flex w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-[#f7f6f6] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <h3 className="w-full truncate py-1 text-lg leading-6 font-medium tracking-tight text-neutral-900">
        {title}
      </h3>

      <div className="relative h-[223px] w-full">
        <Image
          src={imgUrl || "/placeholder.png"}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 335px"
          className="object-contain"
        />
      </div>

      <div className="flex w-full items-end justify-between">
        <div className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2 py-0.5 text-sm">
          <span
            className={`size-1.5 rounded-full ${isAvailable ? "bg-green-600" : "bg-red-600"}`}
          />
          <span className={isAvailable ? "text-green-600" : "text-red-600"}>
            {isAvailable ? "In stock" : "Sold out"}
          </span>
        </div>
        <p className="text-right text-base font-medium text-black">
          PHP {Number(price).toFixed(2)}
        </p>
      </div>
    </button>
  );
}
