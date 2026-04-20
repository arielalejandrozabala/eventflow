import Link from "next/link";
import { COUNTRIES, CountryCode } from "@/lib/constants/countries";

type Props = {
  country?: CountryCode;
};

export default function Navbar({ country }: Props) {
  const countryData = country ? COUNTRIES[country] : null;
  const countryName = countryData?.label.split(" ").slice(1).join(" ") || "";

  return (
    <nav className="flex items-center justify-between py-4 mb-2">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-gray-600 transition">
          EventFlow
        </span>
        {countryData && (
          <>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium">Your Shop</span>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 rounded-full border border-gray-200">
                <span className="text-base leading-none">{countryData.label.split(" ")[0]}</span>
                <span className="text-xs font-semibold text-gray-700">{countryName}</span>
              </div>
            </div>
          </>
        )}
      </Link>

      {/* Placeholder for future actions (cart icon, user menu, etc) */}
      <div className="flex items-center gap-3">
        {/* Future: cart icon, user menu */}
      </div>
    </nav>
  );
}
