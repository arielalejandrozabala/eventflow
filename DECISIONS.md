# Technical Decision Log

This document records key architectural decisions made during development, including context, alternatives considered, and rationale.

---

## ADR-001: Use SSR for Event Pages




### Context
Event pages display product prices and stock availability. This data changes frequently — prices can update due to flash sales, and stock can deplete in real time. We need a rendering strategy that guarantees data freshness.

### Decision
Use Server-Side Rendering (SSR) with no revalidation window for event detail pages. Every request fetches fresh data.

### Alternatives Considered
1. **ISR with short revalidation (30s)**: Initially considered, but rejected because stale prices in a commerce context have real consequences — users could see incorrect prices or add out-of-stock items to cart.
2. **ISR with `revalidateTag`**: Would allow instant invalidation on price changes, but requires a webhook or event system to trigger revalidation. Adds infrastructure complexity.
3. **Client-side fetching**: Moves data fetching to the browser, losing SSR benefits (SEO, TTFB).
4. **Partial Prerendering (PPR)**: Ideal long-term solution — pre-render the static shell (title, hero, description) and stream in volatile data (prices, stock). Next.js 16 supports this via `cacheComponents`. Deferred for now due to complexity.

### Rationale
- Product prices and stock are volatile — staleness has direct business impact
- SSR guarantees every render reflects current data
- React Server Components minimize the JS payload sent to the client
- `generateStaticParams` still pre-builds routes at deploy time for fast initial load

### Consequences
- Higher server load than ISR — every request hits the data layer
- In production, requires connection pooling and read replicas to handle traffic
- Static parts of the page (hero, title) are re-rendered unnecessarily — PPR would solve this

---

## ADR-002: Country Code in URL Path




### Context
Need to support multi-country pricing. Options: URL path, subdomain, query param, or geolocation header.

### Decision
Use URL path: `/[country]/event/[slug]`

### Alternatives Considered
1. **Subdomain** (`us.eventflow.com`): Requires DNS setup, complicates deployment
2. **Query param** (`/event/slug?country=us`): Poor SEO, not cacheable at CDN
3. **Geolocation header**: Can't share region-specific links, cache poisoning risk

### Rationale
- CDN can cache per country (different cache keys)
- Users can share region-specific links
- SEO-friendly (search engines index separately)
- Simple to implement

### Consequences
- URL structure is part of public API (can't change easily)
- Need to validate country param on every request
- Slightly longer URLs

---

## ADR-003: Mock Data Layer with Async Interface




### Context
This is a portfolio project. Setting up a real database adds infrastructure overhead without demonstrating additional skills.

### Decision
Use in-memory mock data with async interface that simulates DB latency (100ms).

### Alternatives Considered
1. **Real Postgres DB**: Requires hosting, migrations, connection pooling
2. **SQLite**: Simpler but still requires file I/O, migrations
3. **Sync mock data**: Unrealistic, doesn't show async handling

### Rationale
- Focus is on architecture, not infrastructure
- Async interface is production-ready (swap in DB query is trivial)
- Simulated latency shows realistic loading states
- Easier for reviewers to run locally (no DB setup)

### Consequences
- Data resets on deploy
- Can't demonstrate DB-specific optimizations (indexes, query planning)
- Need to document that this is intentional simplification

---

## ADR-004: Tailwind CSS v4 over CSS Modules




### Context
Need styling solution that's fast to implement and demonstrates modern practices.

### Decision
Use Tailwind CSS v4 with utility-first approach.

### Alternatives Considered
1. **CSS Modules**: More verbose, harder to maintain consistency
2. **Styled Components**: Runtime cost, larger bundle
3. **Vanilla CSS**: No design system, hard to maintain

### Rationale
- Utility-first is industry standard for rapid development
- Tailwind v4 has zero runtime cost (compile-time)
- Built-in design system (spacing, colors) ensures consistency
- Easy to customize via config

### Consequences
- HTML can look cluttered with many classes
- Learning curve for developers unfamiliar with utility-first
- Purging unused styles requires build step

---

## ADR-005: Jest over Vitest for Testing




### Context
Need testing framework for components and utilities.

### Decision
Use Jest + React Testing Library.

### Alternatives Considered
1. **Vitest**: Faster, better DX, but less mature ecosystem
2. **Playwright Component Testing**: E2E-focused, overkill for unit tests

### Rationale
- Jest is industry standard (most job postings mention it)
- Mature ecosystem, extensive documentation
- React Testing Library is de facto standard for React
- Next.js has built-in Jest support

### Consequences
- Slightly slower than Vitest
- More configuration required than Vitest

---

## ADR-006: Type Guards for Country Validation




### Context
`params.country` comes as `string` but we need `CountryCode` literal type for type safety.

### Decision
Use TypeScript type guard: `isValidCountry(country): country is CountryCode`

### Alternatives Considered
1. **Type assertion** (`country as CountryCode`): Unsafe, no runtime check
2. **Zod schema validation**: Overkill for single field
3. **Accept string everywhere**: Loses type safety benefits

### Rationale
- Type guard provides both runtime validation and type narrowing
- Single source of truth (`ALLOWED_COUNTRIES`)
- TypeScript knows `country` is valid after guard
- Minimal code, maximum safety

### Consequences
- Need to remember to use guard before accessing country-specific data
- Slightly more verbose than type assertion

---

## ADR-007: Separate `not-found.tsx` over Inline Error Handling




### Context
Need to handle invalid country codes and missing events.

### Decision
Use Next.js `notFound()` function with custom `not-found.tsx` component.

### Alternatives Considered
1. **Return error JSX inline**: Inconsistent UX, no proper 404 status
2. **Redirect to error page**: Loses URL context, confusing for users
3. **Throw error**: Triggers error boundary, wrong semantic

### Rationale
- `notFound()` returns proper 404 HTTP status
- Custom `not-found.tsx` provides branded error experience
- Consistent with Next.js conventions
- SEO-friendly (search engines understand 404)

### Consequences
- Need separate `not-found.tsx` file per route segment
- Can't pass custom data to not-found page (by design)

---

## Future Decisions to Document

- Database choice (Postgres vs. MySQL vs. MongoDB)
- Authentication strategy (NextAuth vs. Clerk vs. custom)
- Deployment platform (Vercel vs. self-hosted)
- Monitoring solution (Sentry vs. DataDog vs. New Relic)
