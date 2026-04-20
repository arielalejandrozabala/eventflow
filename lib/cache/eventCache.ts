// In-memory cache with TTL — simulates what Redis or a CDN cache would do.
// In production, replace this with:
//   - Redis (Upstash) for distributed caching across server instances
//   - Next.js fetch cache with cacheTag/revalidateTag for fine-grained invalidation
//   - CDN-level caching (Vercel Edge, Cloudflare) for static-ish responses

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(private ttlMs: number) {}

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }
}

// Event shell data (title, description) — changes rarely, safe to cache longer.
// Products are NOT cached here — they're fetched fresh by the client.
export const eventCache = new TTLCache<unknown>(30 * 1000); // 30s TTL
