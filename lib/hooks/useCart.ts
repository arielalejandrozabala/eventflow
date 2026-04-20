"use client";

// useCart is now a thin re-export of the Zustand store.
// This keeps the public API stable — components import from here,
// not directly from the store, making future migrations easier.
export { useCartStore as useCart } from "@/lib/store/cartStore";
export type { CartItem } from "@/lib/store/cartStore";
