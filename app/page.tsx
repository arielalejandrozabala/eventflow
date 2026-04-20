export const revalidate = 60;

import Link from "next/link";
import { getAllEvents } from "@/lib/data/events";
import { COUNTRIES } from "@/lib/constants/countries";

export default async function Home() {
  const events = await getAllEvents();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold">EventFlow</h1>
        <p className="text-gray-500 mt-2">
          Dynamic event platform with multi-country pricing
        </p>
      </div>

      {Object.values(COUNTRIES).map((country) => (
        <section key={country.code}>
          <h2 className="text-xl font-semibold mb-4">{country.label}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => (
              <Link
                key={event.slug}
                href={`/${country.code}/event/${event.slug}`}
                className="block bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{event.description}</p>
                <span className="inline-block mt-3 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {event.products?.length ?? 0} products
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
