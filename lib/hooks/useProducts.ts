"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/event";

type State =
  | { status: "loading" }
  | { status: "success"; products: Product[] }
  | { status: "error"; message: string };

export function useProducts(slug: string): State {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch(`/api/events/${slug}/products`);
        if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
        const products: Product[] = await res.json();
        if (!cancelled) setState({ status: "success", products });
      } catch (err) {
        if (!cancelled)
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [slug]);

  return state;
}
