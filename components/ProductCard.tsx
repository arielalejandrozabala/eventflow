"use client";

import Image from "next/image";
import { Product } from "@/lib/types/event";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/lib/store/cartStore";
import { useState } from "react";

type Props = {
  product: Product;
  country: string;
};

export default function ProductCard({ product, country }: Props) {
  const { addItem, increment, decrement, removeItem, items } = useCartStore();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  function handleAdd() {
    addItem(product, country);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex-shrink-0 w-64 snap-start"
      aria-label={`${product.name} product card`}
    >
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="256px"
        />
      </div>

      <div className="p-4 space-y-3">
        <h2 className="font-semibold text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </h2>
        <p className="text-xl font-bold text-gray-900" aria-label={`Price: ${formatPrice(product.price, country)}`}>
          {formatPrice(product.price, country)}
        </p>

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              added
                ? "bg-green-500 text-white scale-95"
                : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
            }`}
          >
            {added ? "✓ Added" : "Add to cart"}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrement(product.id)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => increment(product.id)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition flex items-center justify-center"
              aria-label="Increase quantity"
            >
              +
            </button>
            <button
              onClick={() => removeItem(product.id)}
              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition flex items-center justify-center text-xs"
              aria-label="Remove from cart"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
