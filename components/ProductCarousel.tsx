"use client";

import { useRef } from "react";
import { Product } from "@/lib/types/event";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  country: string;
};

export default function ProductCarousel({ products, country }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "right" ? 280 : -280,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} country={country} />
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3
                   bg-white border border-gray-200 shadow-md rounded-full w-9 h-9
                   flex items-center justify-center text-lg
                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
      >
        ‹
      </button>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3
                   bg-white border border-gray-200 shadow-md rounded-full w-9 h-9
                   flex items-center justify-center text-lg
                   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10"
      >
        ›
      </button>
    </div>
  );
}
