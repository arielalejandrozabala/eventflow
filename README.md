# EventFlow – Dynamic Event Platform

A simplified high-traffic event platform focused on rendering strategies, multi-region support, and performance trade-offs.

> "I built this to demonstrate SSR/ISR patterns, multi-country routing, and component architecture — the kind of decisions that matter at scale."

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **React 19**

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design, request flow diagrams, and scaling considerations.

See [DECISIONS.md](./DECISIONS.md) for technical decision records (ADRs) explaining key architectural choices.

### Routing

```
/[country]/event/[slug]
```

Multi-country dynamic routing. Supported countries: `us`, `ar`, `br`. Each country renders the same event with localized currency formatting via `Intl.NumberFormat`.

### Data Layer

`lib/data/events.ts` simulates an async data source with artificial latency (100ms) to reflect realistic fetch behavior. In production this would be replaced by a DB query or external API call.

### Component Structure

```
app/
  page.tsx                        # Home – SSG (revalidate: 60s)
  [country]/event/[slug]/
    page.tsx                      # Event detail – SSR (always fresh)
    loading.tsx                   # Streaming loading UI
    error.tsx                     # Error boundary (client component)
components/
  EventDetail.tsx                 # Client shell — owns cart state
  ProductCarousel.tsx             # Client component — renders volatile product data
  ProductCard.tsx                 # Client component — add to cart interactions
  CartDrawer.tsx                  # Client component — Zustand cart state
  Hero.tsx                        # Server component — static event content
  Countdown.tsx                   # Client component — timer
  Navbar.tsx                      # Server component — country display
lib/
  data/events.ts                  # Data access layer
  store/cartStore.ts              # Zustand cart store with persist
  types/event.ts                  # Shared types
  utils/currency.ts               # Intl currency formatter
  constants/countries.ts          # Country config + type guards
```

## Rendering Strategy

| Route | Strategy | Rationale |
|---|---|---|
| `/` | SSG + ISR (60s) | Event list changes infrequently |
| `/[country]/event/[slug]` | SSR | Product prices and stock are volatile |
| Cart, product interactions | Client only | User-specific, no SEO value |

### Why SSR for event pages?

Event pages contain **product prices and stock availability** — data that can change at any moment. ISR would serve stale prices for up to N seconds, which is unacceptable in a commerce context where:

- A product could go out of stock between revalidations
- Prices can change due to flash sales or inventory adjustments
- Users expect the price they see to match what they pay

SSR guarantees every request gets fresh data from the source. The trade-off is higher server load, which is mitigated by:
- CDN caching of static assets (JS, CSS, images)
- `generateStaticParams` still pre-builds routes at deploy time
- React Server Components minimize the JS sent to the client

### What stays static

The event **shell** (title, description, hero image, countdown end date) is stable and could be cached. In production, this is where **Partial Prerendering (PPR)** would shine — pre-render the shell statically, stream in the volatile product data. Next.js 16 supports this via `cacheComponents`.

### Trade-offs

| Decision | Trade-off |
|---|---|
| No database | Simplified for demo; real version would use a DB with connection pooling |
| Mock latency | Simulates real async behavior without infrastructure overhead |
| Country in URL | Enables CDN edge caching per region; alternative would be geolocation headers |
| SSR over ISR for events | Always fresh data; higher server load vs. ISR with stale risk |
| Client-side cart | Zero server cost; state lost on hard refresh without persist |

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

Test coverage includes:
- **Component tests**: `ProductCard` rendering and currency formatting
- **Data layer tests**: `getAllEvents`, `getEvent` with async behavior validation
- **Utility tests**: `formatPrice` with multiple currencies and edge cases

All tests use Jest + React Testing Library.

## How to Scale

### Caching Strategy

The app implements a layered caching approach:

| Layer | Implementation | TTL |
|---|---|---|
| In-memory (server) | `TTLCache` in `lib/cache/eventCache.ts` | 30s |
| CDN (production) | Vercel Edge Network | Per route config |
| Client state | Zustand + localStorage | Session |

The in-memory cache (`TTLCache`) simulates what Redis or a CDN cache would do in production — subsequent requests for the same event within the TTL window skip the data layer entirely. In a real scenario, this would be replaced with:

- **Redis (Upstash)** for distributed caching across server instances
- **Next.js `cacheTag` + `revalidateTag`** for fine-grained invalidation when event data changes
- **CDN-level caching** at Vercel Edge or Cloudflare for static-ish responses

Note: product data (prices, stock) is intentionally **not cached** at the server layer — it's fetched fresh by the client on every page load via `/api/events/[slug]/products`.

### Database Layer
- **Connection pooling**: Use Prisma with PgBouncer or Drizzle with connection pooling to handle high concurrency
- **Read replicas**: Route read queries to replicas, writes to primary
- **Query optimization**: Add indexes on `slug` and `country` columns for fast lookups

### Observability
- **OpenTelemetry tracing**: Instrument data fetching functions to track p95/p99 latency per route
- **Error tracking**: Integrate Sentry for client and server error monitoring
- **Performance monitoring**: Track Core Web Vitals (LCP, FID, CLS) per country/route

### Feature Management
- **Feature flags**: Use LaunchDarkly or similar to gate new event types or UI variants per country without deploys
- **A/B testing**: Test pricing display formats or product card layouts per region
- **Gradual rollouts**: Deploy changes to 5% → 25% → 100% of traffic

### Infrastructure
- **Multi-region deployment**: Deploy to Vercel regions closest to target countries (us-east-1, sa-east-1, eu-west-1)
- **Edge middleware**: Use Vercel Edge Functions for geolocation-based redirects or A/B test assignment
- **Rate limiting**: Implement per-IP rate limiting at the edge to prevent abuse

### Code Quality
- **E2E tests**: Add Playwright tests for critical user flows (home → event detail → product view)
- **Visual regression**: Use Percy or Chromatic to catch unintended UI changes
- **Bundle analysis**: Monitor bundle size with `@next/bundle-analyzer` to prevent bloat

## Live Demo

_Deploy link here_

---

## Engineering Decisions

### Why Next.js 16 App Router?
- **React Server Components** reduce client bundle size — data fetching happens on the server
- **Streaming** with `loading.tsx` improves perceived performance
- **SSR by default** ensures volatile data (prices, stock) is always fresh

### Why SSR over ISR for event pages?

ISR was the initial approach, but event pages contain product prices and stock availability — data that changes frequently and where staleness has real consequences. Serving a cached price that's 30 seconds old in a commerce context means:

- Users could add an out-of-stock item to cart
- The price shown could differ from the price charged
- Flash sales or inventory changes wouldn't reflect immediately

SSR guarantees every page render fetches fresh data. The performance cost is offset by React Server Components (minimal JS to client) and CDN caching of static assets.

For the static parts of the page (title, description, hero), **Partial Prerendering** would be the ideal next step — pre-render the shell, stream in the volatile data.

### Why client-side cart?
- Cart state is per-user — no SEO value, no need to render on server
- Zustand with `persist` gives instant interactions with localStorage durability
- Decoupled from server state — cart survives navigation without API calls

### Performance optimizations
- **`React.memo` on `ProductCard`**: When any cart item changes, Zustand notifies all subscribed components. Without `memo`, all N cards in the carousel re-render. With `memo`, React compares props — only the card whose quantity changed re-renders. This is render output caching, not data caching.
- **`useMemo` for price formatting**: `Intl.NumberFormat` has non-trivial overhead. Memoized per `[price, country]` — only recalculates when those values change.
- **`useMemo` for cart total**: The drawer re-renders on every store change. Total only recalculates when `items` changes.
- **Lazy `useState` initializer in Countdown**: `getTimeLeft()` runs on first render (server + client) instead of waiting for `useEffect`, eliminating the mount → update cycle that caused layout shift.

### Why country in URL vs. geolocation header?
- **CDN caching**: `/us/event/black-friday` and `/ar/event/black-friday` are different cache keys — no cache poisoning risk
- **Shareability**: Users can share region-specific links
- **SEO**: Search engines can index country-specific pages separately

### Why mock data instead of real DB?
This is a portfolio project focused on **architecture decisions**, not infrastructure setup. The async interface (`getAllEvents`, `getEvent`) is production-ready — swapping in a DB query is a 5-line change.

### Trade-offs Made
| Decision | Pro | Con | Mitigation |
|---|---|---|---|
| SSR for event pages | Always fresh prices/stock | Higher server load than ISR | RSC minimizes JS; CDN caches static assets |
| ISR for home (60s) | Low server load | Slightly stale event list | Acceptable — new events don't need instant visibility |
| Client-side cart | Zero server cost, instant UX | State lost without persist | Zustand persist saves to localStorage |
| No authentication | Simpler demo | Can't show user-specific pricing | Add NextAuth.js + session-based pricing in production |
| Mock latency (100ms) | Realistic async behavior | Not real network conditions | Replace with actual DB query + monitoring |
