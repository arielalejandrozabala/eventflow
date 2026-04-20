import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/types/event";
import { CountryCode, COUNTRIES } from "@/lib/constants/countries";

type Props = {
  event: Event;
  country: CountryCode;
};

export default function EventCard({ event, country }: Props) {
  const countryData = COUNTRIES[country];

  return (
    <Link
      href={`/${country}/event/${event.slug}`}
      className="group relative overflow-hidden rounded-2xl h-72 flex flex-col justify-end block"
    >
      {/* Background image */}
      <Image
        src={`https://picsum.photos/seed/${event.slug}-${country}/800/600`}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Live now
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        </div>

        <h2 className="text-2xl font-extrabold text-white leading-tight">
          {event.title}
        </h2>

        <p className="text-sm text-white/70 line-clamp-1">
          {event.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1.5 text-sm text-white/80">
            {countryData.label.split(" ")[0]}
            <span className="font-medium">{countryData.label.split(" ").slice(1).join(" ")}</span>
          </span>
          <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium group-hover:bg-white group-hover:text-gray-900 transition-colors">
            Shop now →
          </span>
        </div>
      </div>
    </Link>
  );
}
