export const revalidate = 30;

import { getEvent, getAllEvents } from "@/lib/api/events";
import EventDetail from "@/components/event/EventDetail";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALLOWED_COUNTRIES, CountryCode } from "@/lib/constants/countries";

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

  return <EventDetail event={event} country={country} />;
}