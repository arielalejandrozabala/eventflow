import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types/event";

export type CartItem = {
  product: Product;
  quantity: number;
  country: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, country: string) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  removeItem: (productId: number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem(product, country) {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1, country }] };
        });
      },

      increment(productId) {
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decrement(productId) {
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (!item) return state;
          if (item.quantity <= 1) {
            return { items: state.items.filter((i) => i.product.id !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
      },

      removeItem(productId) {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },
    }),
    { name: "eventflow-cart" }
  )
);
