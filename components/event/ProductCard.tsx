"use client";

import Image from "next/image";
import { memo, useState, useMemo } from "react";
import { Product } from "@/lib/types/event";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/lib/store/cartStore";

type Props = {
  product: Product;
  country: string;
};

// React.memo prevents unnecessary re-renders of sibling cards.
// When any cart item changes, Zustand notifies all subscribed components.
// Without memo: all 4 cards re-render on every cart update.
// With memo: only the card whose product.id matches the changed item re-renders.
const ProductCard = memo(function ProductCard({ product, country }: Props) {
  const { addItem, increment, decrement, removeItem, items } = useCartStore();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  // Memoized — price formatting is pure and only depends on price + country.
  const formattedPrice = useMemo(
    () => formatPrice(product.price, country),
    [product.price, country]
  );

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
        <p className="text-xl font-bold text-gray-900" aria-label={`Price: ${formattedPrice}`}>
          {formattedPrice}
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
});

export default ProductCard;
