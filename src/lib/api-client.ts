// src/lib/api-client.ts
// Shared API client for https://api.tenrai.org/v1 (Jikan-compatible API)
//
// Performance layers, checked in order:
//   1. In-memory TTL cache — instant response, skips the rate limiter.
//   2. In-flight dedupe    — concurrent identical requests share one fetch.
//   3. Rate limiter        — upstream allows ~3 req/s; applied only to
//                            actual network misses.
//   4. Next.js Data Cache  — `next: { revalidate }` persists responses
//                            across requests and cold starts.

const TENRAI_BASE = "https://api.tenrai.org/v1";

// Rate limit helper - allow 3 req/s with 350ms spacing (network misses only)
let lastRequest = 0;
export async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequest;
  if (elapsed < 350) {
    await new Promise((resolve) => setTimeout(resolve, 350 - elapsed));
  }
  lastRequest = Date.now();
}

// Hard timeout so a hung upstream request can never block the shared
// rate-limit queue forever (this caused "stuck loading" states).
const UPSTREAM_TIMEOUT_MS = 10_000;

const MEMORY_MAX_ENTRIES = 500;
const HOUR_MS = 60 * 60 * 1000;

interface MemoryEntry {
  expiresAt: number;
  value: unknown;
}

const memoryCache = new Map<string, MemoryEntry>();
const inFlight = new Map<string, Promise<unknown>>();

function memoryCacheGet(key: string): unknown {
  const entry = memoryCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return undefined;
  }
  return entry.value;
}

function memoryCacheSet(key: string, value: unknown, ttlMs: number) {
  if (memoryCache.size >= MEMORY_MAX_ENTRIES) {
    const now = Date.now();
    for (const [k, entry] of memoryCache) {
      if (now > entry.expiresAt) memoryCache.delete(k);
    }
    // Still full after eviction — drop everything to stay bounded.
    if (memoryCache.size >= MEMORY_MAX_ENTRIES) memoryCache.clear();
  }
  memoryCache.set(key, { expiresAt: Date.now() + ttlMs, value });
}

export interface GetOptions {
  /** Seconds for the Next.js Data Cache (network-layer freshness). */
  revalidate?: number;
  /** Milliseconds for the in-memory cache (warm-instance freshness). */
  ttlMs?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options: GetOptions = {}): Promise<T> {
    const cacheKey = `${this.baseUrl}${endpoint}`;

    // 1. Memory cache — return immediately, no rate limiting.
    const cached = memoryCacheGet(cacheKey);
    if (cached !== undefined) {
      return cached as T;
    }

    // 2. Dedupe concurrent identical requests (e.g. enriching a list that
    //    contains the same anime twice, or overlapping page requests).
    const pending = inFlight.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }

    const request = (async () => {
      // 3. Rate limit only actual network misses.
      await rateLimit();
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        // 4. Next.js Data Cache — repeat calls never touch the upstream API.
        next: { revalidate: options.revalidate ?? 60 },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      if (!res.ok) {
        throw new Error(`Tenrai API error: ${res.status} for ${endpoint}`);
      }
      const json = (await res.json()) as T;
      memoryCacheSet(cacheKey, json, options.ttlMs ?? 60_000);
      return json;
    })();

    inFlight.set(cacheKey, request);
    try {
      return await request;
    } finally {
      inFlight.delete(cacheKey);
    }
  }

  // ============================================================
  // Anime endpoints
  // ============================================================

  // Anime metadata is stable — cache it aggressively.
  async getAnimeFull(id: number) {
    return this.get<{ data: Record<string, unknown> }>(`/anime/${id}/full`, {
      revalidate: 86_400,
      ttlMs: 6 * HOUR_MS,
    });
  }

  async getAnimeById(id: number) {
    return this.get<{ data: Record<string, unknown> }>(`/anime/${id}`, {
      revalidate: 86_400,
      ttlMs: 6 * HOUR_MS,
    });
  }

  async getAnimeCharacters(id: number) {
    return this.get<{ data: Record<string, unknown>[] }>(`/anime/${id}/characters`, {
      revalidate: 86_400,
      ttlMs: 6 * HOUR_MS,
    });
  }

  async getAnimeRecommendations(id: number) {
    return this.get<{ data: Record<string, unknown>[] }>(`/anime/${id}/recommendations`, {
      revalidate: 86_400,
      ttlMs: 6 * HOUR_MS,
    });
  }

  async getAnimeEpisodes(id: number, page = 1) {
    return this.get<{ data: Record<string, unknown>[]; pagination: Record<string, unknown> }>(
      `/anime/${id}/episodes?page=${page}`,
      { revalidate: 3_600, ttlMs: HOUR_MS }
    );
  }

  async searchAnime(query: string, page = 1, limit = 24) {
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(
      `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&order_by=popularity&sort=desc`,
      { revalidate: 120, ttlMs: 2 * 60 * 1000 }
    );
  }

  async getTopAnime(filter?: string, page = 1, limit = 15) {
    const filterParam = filter ? `&filter=${filter}` : "";
    const isTrending = filter === "airing";
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(
      `/top/anime?page=${page}&limit=${limit}${filterParam}`,
      isTrending
        ? { revalidate: 300, ttlMs: 2 * 60 * 1000 } // trending moves fast
        : { revalidate: 3_600, ttlMs: 30 * 60 * 1000 } // all-time popular is stable
    );
  }

  async getSeasonalAnime(year: number, season: string, page = 1, limit = 15) {
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(
      `/seasons/${year}/${season}?page=${page}&limit=${limit}`,
      { revalidate: 3_600, ttlMs: 30 * 60 * 1000 }
    );
  }
}

export const apiClient = new ApiClient(TENRAI_BASE);