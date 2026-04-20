"use client";

import { Event } from "@/lib/types/event";
import ProductCarousel from "@/components/event/ProductCarousel";
import ProductCarouselSkeleton from "@/components/event/ProductCarouselSkeleton";
import CartDrawer from "@/components/cart/CartDrawer";
import Hero from "@/components/event/Hero";
import Countdown from "@/components/event/Countdown";
import Navbar from "@/components/shared/Navbar";
import { CountryCode } from "@/lib/constants/countries";
import { useProducts } from "@/lib/hooks/useProducts";

// EventDetail receives the event shell (title, description, dates) from the server.
// Product data is fetched client-side so prices and stock are always fresh,
// independent of the SSR render cycle.
type Props = {
  event: Omit<Event, "products">;
  country: string;
};

export default function EventDetail({ event, country }: Props) {
  const productsState = useProducts(event.slug);

  return (
    <>
      <Navbar country={country as CountryCode} />

      <div className="space-y-8">
        {/* SSR — static event shell */}
        <Hero
          title={event.title}
          subtitle={event.description}
          badge="Up to 25% off"
          imageUrl={`https://picsum.photos/seed/${event.slug}/1200/400`}
        />

        <Countdown expiresAt={event.expiresAt} />

        {/* Client-side — fresh product data fetched after shell renders */}
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
      </div>

      <CartDrawer />
    </>
  );
}
