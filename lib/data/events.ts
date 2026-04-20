import { Event } from "@/lib/types/event";

const EVENTS: Event[] = [
  {
    slug: "black-friday",
    title: "Black Friday",
    description: "Massive discounts across all categories",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    products: [
      { id: 1, name: "Laptop Acer Core i5", price: 1000, image: "https://picsum.photos/seed/laptop/400/300" },
      { id: 2, name: "iPhone 13", price: 500, image: "https://picsum.photos/seed/iphone/400/300" },
      { id: 3, name: "Samsung 4K Monitor", price: 350, image: "https://picsum.photos/seed/monitor/400/300" },
      { id: 4, name: "Mechanical Keyboard", price: 120, image: "https://picsum.photos/seed/keyboard/400/300" },
    ]
  },
  {
    slug: "cyber-monday",
    title: "Cyber Monday",
    description: "Exclusive online deals",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    products: [
      { id: 1, name: "Playstation 5", price: 1500, image: "https://picsum.photos/seed/ps5/400/300" },
      { id: 2, name: "Ram G.Skill DDR5 16gb", price: 500, image: "https://picsum.photos/seed/ram/400/300" },
      { id: 3, name: "RTX 4080 GPU", price: 1200, image: "https://picsum.photos/seed/gpu/400/300" },
      { id: 4, name: "AirPods Pro", price: 250, image: "https://picsum.photos/seed/airpods/400/300" },
    ]
  },
];

export async function getAllEvents(): Promise<Event[]> {
  // Simulates DB query latency. In production:
  // - Use connection pooling (e.g., Prisma with pgBouncer)
  // - Add query-level caching with Redis
  // - Consider read replicas for high-traffic reads
  await new Promise((res) => setTimeout(res, 100));
  return EVENTS;
}

export async function getEvent(slug: string): Promise<Event | null> {
  // simulamos latencia (realista)
  await new Promise((res) => setTimeout(res, 100));

  return EVENTS.find((e) => e.slug === slug) || null;
}