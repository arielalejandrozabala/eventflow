import { Event } from "@/lib/types/event";

// Mock data store — simulates a database or external API response.
// In production, this would be replaced by actual DB queries or API calls
// in lib/api/events.ts. The data shape here mirrors what the API would return.
export const EVENTS: Event[] = [
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
    ],
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
    ],
  },
];
