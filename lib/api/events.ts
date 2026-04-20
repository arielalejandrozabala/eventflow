import { Event } from "@/lib/types/event";
import { EVENTS } from "@/lib/data/events";

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
  // Simulates network/DB latency.
  // In production: DB query with connection pooling or external API fetch.
  await new Promise((res) => setTimeout(res, 100));
  return EVENTS;
}

export async function getEvent(slug: string): Promise<Event | null> {
  // Simulates network/DB latency.
  // In production: indexed DB lookup or cached API response.
  await new Promise((res) => setTimeout(res, 100));
  return EVENTS.find((e) => e.slug === slug) ?? null;
}
