import { Event } from "@/lib/types/event";
import { EVENTS } from "@/lib/data/events";
import { eventCache } from "@/lib/cache/eventCache";

// API layer — abstracts data access from the UI.
// Components and pages import from here, never from lib/data directly.
//
// To migrate to a real backend, replace the mock implementations below
// with actual fetch calls or DB queries. The interface stays the same.
//
// Example production implementation:
//   export async function getEvent(slug: string): Promise<Event | null> {
//     const res = await fetch(`${process.env.API_URL}/events/${slug}`, {
//       next: { tags: [`event-${slug}`] },
//     })
//     if (!res.ok) return null
//     return res.json()
//   }

export async function getAllEvents(): Promise<Event[]> {
  try {
    // Note: the home page already uses ISR (revalidate: 60s), so Next.js caches
    // the rendered HTML. This in-memory cache adds a second layer that prevents
    // concurrent revalidation requests from all hitting the data layer simultaneously.
    // In production, ISR alone may be sufficient here — the trade-off is simplicity
    // vs. protection against thundering herd during revalidation windows.
    const cached = eventCache.get("all_events") as Event[] | null;
    if (cached) return cached;

    // Simulates network/DB latency.
    // In production: DB query with connection pooling or external API fetch.
    await new Promise((res) => setTimeout(res, 100));

    eventCache.set("all_events", EVENTS);
    return EVENTS;
  } catch (e) {
    throw new Error("Failed to fetch events", { cause: e });
  }
}

export async function getEvent(slug: string): Promise<Event | null> {
  try {
    const cacheKey = `event_${slug}`;
    const cached = eventCache.get(cacheKey) as Event | null;
    if (cached) return cached;

    // Simulates network/DB latency.
    // In production: indexed DB lookup or cached API response.
    await new Promise((res) => setTimeout(res, 100));

    const event = EVENTS.find((e) => e.slug === slug) ?? null;
    if (event) eventCache.set(cacheKey, event);

    return event;
  } catch (e) {
    throw new Error(`Failed to fetch event: ${slug}`, { cause: e });
  }
}
