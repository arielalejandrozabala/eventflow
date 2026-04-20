"use client";

import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils/currency";
import Image from "next/image";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, increment, decrement, removeItem } = useCartStore();

  useEffect(() => { setMounted(true) }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const country = items[0]?.country ?? "us";

  // Memoized — avoids recalculating on every render when unrelated state changes.
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  // Don't render on server or before hydration
  if (!mounted) return null;
  if (totalItems === 0) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer — always in DOM, slides in/out via transform */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-40
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900">
            Cart
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.map(({ product, quantity, country: itemCountry }) => (
            <div key={product.id} className="flex gap-3 items-center">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {formatPrice(product.price * quantity, itemCountry)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => decrement(product.id)}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition flex items-center justify-center text-sm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => increment(product.id)}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition flex items-center justify-center text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition flex items-center justify-center text-xs ml-1"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(total, country)}
            </span>
          </div>
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition active:scale-95">
            Checkout
          </button>
        </div>
      </div>

      {/* FAB Badge — hidden when drawer is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl
                     flex items-center gap-3 hover:bg-gray-700 transition active:scale-95"
          aria-label="Open cart"
        >
          <span className="text-lg">🛒</span>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400 leading-none">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            <span className="font-semibold text-sm leading-tight">
              {formatPrice(total, country)}
            </span>
          </div>
        </button>
      )}
    </>
  );
}
