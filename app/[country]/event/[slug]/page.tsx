// SSR — renders the event shell (title, description, hero) on every request.
// Product data is intentionally excluded here — the client fetches it independently
// via /api/events/[slug]/products so prices and stock are always fresh.
// This hybrid approach demonstrates: SSR shell + client-side volatile data.
export const dynamic = "force-dynamic";

import { getEvent, getAllEvents } from "@/lib/api/events";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALLOWED_COUNTRIES, CountryCode } from "@/lib/constants/countries";
import Hero from "@/components/event/Hero";
import Countdown from "@/components/event/Countdown";
import Navbar from "@/components/shared/Navbar";
import ProductsSection from "@/components/event/ProductsSection";

type Props = {
  params: Promise<{ country: string; slug: string }>;
};

function isValidCountry(country: string): country is CountryCode {
  return (ALLOWED_COUNTRIES as readonly string[]).includes(country);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} - ${country.toUpperCase()} | EventFlow`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
    },
  };
}

/**
 * Pre-generates all country/event combinations at build time.
 * This ensures zero cold starts for any valid route.
 * 
 * In production with 1000s of events, consider:
 * - Generating only top N events statically
 * - Using on-demand ISR for long-tail content
 * - Implementing stale-while-revalidate at CDN layer
 */
export async function generateStaticParams() {
  const events = await getAllEvents();
  return ALLOWED_COUNTRIES.flatMap((country) =>
    events.map((event) => ({ country, slug: event.slug }))
  );
}

export default async function EventPage({ params }: Props) {
  const { country, slug } = await params;

  if (!isValidCountry(country)) {
    notFound();
  }

  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  // Server renders the shell — hero, countdown, navbar arrive in the initial HTML.
  // ProductsSection is a client island that fetches prices/stock independently.
  return (
    <>
      <Navbar country={country} />
      <div className="space-y-8">
        <Hero
          title={event.title}
          subtitle={event.description}
          badge="Up to 25% off"
          imageUrl={`https://picsum.photos/seed/${event.slug}/1200/400`}
        />
        <Countdown expiresAt={event.expiresAt} />
        <ProductsSection slug={event.slug} country={country} />
      </div>
    </>
  );
}