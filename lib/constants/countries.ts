export const COUNTRIES = {
  us: { code: "us", label: "🇺🇸 United States", currency: "USD" },
  ar: { code: "ar", label: "🇦🇷 Argentina", currency: "ARS" },
  br: { code: "br", label: "🇧🇷 Brazil", currency: "BRL" },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const ALLOWED_COUNTRIES = ["us", "ar", "br"] as const satisfies CountryCode[];
