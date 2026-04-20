import { COUNTRIES } from "@/lib/constants/countries";

export function formatPrice(price: number, country: string) {
  const countryData = COUNTRIES[country as keyof typeof COUNTRIES];
  const currency = countryData?.currency || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}