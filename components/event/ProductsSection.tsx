"use client";

// Client component — fetches product data independently after the SSR shell renders.
// This ensures prices and stock are always fresh without blocking the initial HTML.
import ProductCarousel from "@/components/event/ProductCarousel";
import ProductCarouselSkeleton from "@/components/event/ProductCarouselSkeleton";
import CartDrawer from "@/components/cart/CartDrawer";
import { useProducts } from "@/lib/hooks/useProducts";

type Props = {
  slug: string;
  country: string;
};

export default function ProductsSection({ slug, country }: Props) {
  const productsState = useProducts(slug);

  return (
    <>
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Featured Products
        </h2>

        {productsState.status === "loading" && <ProductCarouselSkeleton />}

        {productsState.status === "error" && (
          <p className="text-sm text-red-500">{productsState.message}</p>
        )}

        {productsState.status === "success" &&
          productsState.products.length > 0 && (
            <ProductCarousel
              products={productsState.products}
              country={country}
            />
          )}
      </section>

      <CartDrawer />
    </>
  );
}
