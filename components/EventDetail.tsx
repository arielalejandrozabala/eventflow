"use client";

import { Event } from "@/lib/types/event";
import ProductCarousel from "./ProductCarousel";
import CartDrawer from "./CartDrawer";
import Hero from "./Hero";
import Countdown from "./Countdown";
import Navbar from "./Navbar";
import { CountryCode } from "@/lib/constants/countries";

type Props = {
  event: Event;
  country: string;
};

export default function EventDetail({ event, country }: Props) {
  return (
    <>
      <Navbar country={country as CountryCode} />
      
      <div className="space-y-8">
        <Hero
          title={event.title}
          subtitle={event.description}
          badge="Up to 25% off"
          imageUrl={`https://picsum.photos/seed/${event.slug}/1200/400`}
        />

        <Countdown expiresAt={event.expiresAt} />

        {event.products && event.products.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Featured Products
            </h2>
            <ProductCarousel products={event.products} country={country} />
          </section>
        )}
      </div>

      <CartDrawer />
    </>
  );
}
