# Architecture Deep Dive

## Request Flow

```
User Request
    ↓
CDN (Vercel Edge)
    ↓
Next.js Server (ISR)
    ↓
Data Layer (mock/DB)
    ↓
React Server Component
    ↓
HTML Response (streamed)
```

## ISR Lifecycle

```
Build Time:
  generateStaticParams() → Pre-render all routes → Store in cache

First Request (cache hit):
  Request → CDN → Serve cached HTML (instant)

After revalidate window (30s):
  Request → CDN → Serve stale HTML (instant)
         → Background: Fetch fresh data → Re-render → Update cache

Cache miss (new route):
  Request → Server → Render on-demand → Cache → Serve
```

## Data Flow

```
app/[country]/event/[slug]/page.tsx
    ↓
lib/data/events.ts (data access layer)
    ↓
Mock data (EVENTS array)

In production:
    ↓
Database (Postgres/MySQL)
    ↓
Connection pool (Prisma/Drizzle)
    ↓
Optional: Redis cache layer
```

## Component Hierarchy

```
app/layout.tsx (Root Layout)
    ↓
app/page.tsx (Home - SSG)
    ↓
    Link → app/[country]/event/[slug]/page.tsx (Event Detail - ISR)
                ↓
                components/ProductCard.tsx (Reusable)
```

## Type Safety Flow

```
lib/types/event.ts
    ↓
    Event, Product types
    ↓
lib/data/events.ts (typed return values)
    ↓
app/[country]/event/[slug]/page.tsx (typed props)
    ↓
components/ProductCard.tsx (typed props)
```

## Performance Optimizations

### 1. Static Generation
- `generateStaticParams` pre-builds all routes at build time
- Zero cold starts for valid routes
- HTML served from CDN edge locations

### 2. Streaming
- `loading.tsx` shows skeleton UI immediately
- Page content streams in as data resolves
- Improves perceived performance (LCP)

### 3. Code Splitting
- Each route is a separate chunk
- Components lazy-loaded on demand
- Reduces initial bundle size

### 4. Server Components
- Data fetching happens on server
- Zero client-side JavaScript for static content
- Smaller client bundle

## Scaling Considerations

### Current Limits
- **Mock data**: No persistence, resets on deploy
- **Single region**: All requests hit one server
- **No caching layer**: Every revalidation hits data source

### Production Requirements
- **Database**: Postgres with connection pooling (100+ concurrent connections)
- **Redis**: Cache hot events (top 20% account for 80% of traffic)
- **Multi-region**: Deploy to 3+ regions (US, EU, LATAM)
- **CDN**: Vercel Edge Network or Cloudflare
- **Monitoring**: DataDog/New Relic for APM

### Load Estimates
Assuming 1M events/month:
- **Avg**: ~385 req/min
- **Peak**: ~2k req/min (during event launches)

With ISR (30s revalidate):
- **Cache hit rate**: ~95%
- **Server renders**: ~100 req/min (5% of traffic)
- **DB queries**: ~100 queries/min

Without ISR (pure SSR):
- **Server renders**: 2k req/min
- **DB queries**: 2k queries/min
- **20x higher load**

## Security Considerations

### Input Validation
- `country` param validated against whitelist (`ALLOWED_COUNTRIES`)
- `slug` param sanitized by Next.js routing
- Type guards prevent invalid data from reaching components

### XSS Prevention
- React escapes all user content by default
- No `dangerouslySetInnerHTML` used
- Tailwind classes are static (no dynamic class injection)

### Rate Limiting
- Not implemented in demo
- Production: Use Vercel Edge Config or Upstash Redis
- Limit: 100 req/min per IP

### CORS
- Not needed (same-origin requests only)
- If adding API routes: Use Next.js CORS middleware

## Monitoring Strategy

### Metrics to Track
- **TTFB**: Time to first byte (target: <200ms)
- **LCP**: Largest contentful paint (target: <2.5s)
- **Cache hit rate**: % of requests served from cache (target: >90%)
- **Error rate**: 5xx errors per minute (target: <0.1%)
- **p95 latency**: 95th percentile response time (target: <500ms)

### Alerts
- Error rate > 1% for 5 minutes
- p95 latency > 1s for 5 minutes
- Cache hit rate < 80% for 10 minutes

### Dashboards
- Real-time traffic by country
- Top events by views
- Error breakdown by route
- Cache performance metrics
