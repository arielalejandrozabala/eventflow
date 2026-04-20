// SSG with ISR — pre-rendered at build time, revalidated every 60s in the background.
// The event list changes infrequently, so stale-while-revalidate is an acceptable trade-off.
export const revalidate = 60;

import { getAllEvents } from "@/lib/api/events";
import { ALLOWED_COUNTRIES } from "@/lib/constants/countries";
import EventCard from "@/components/home/EventCard";
import HomeHero from "@/components/home/HomeHero";
import Navbar from "@/components/shared/Navbar";

export default async function Home() {
  const events = await getAllEvents();

  return (
    <>
      <Navbar />
      <HomeHero />

      <div className="space-y-12 pb-16">
        {ALLOWED_COUNTRIES.map((country) => (
          <section key={country}>
            <div className="grid gap-5 sm:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event.slug} event={event} country={country} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
