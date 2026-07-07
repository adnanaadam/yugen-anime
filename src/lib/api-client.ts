// src/lib/api-client.ts
// Shared API client for https://api.tenrai.org/v1 (Jikan-compatible API)

const TENRAI_BASE = "https://api.tenrai.org/v1";

// Rate limit helper - allow 3 req/s with 350ms spacing
let lastRequest = 0;
export async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequest;
  if (elapsed < 350) {
    await new Promise((resolve) => setTimeout(resolve, 350 - elapsed));
  }
  lastRequest = Date.now();
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    await rateLimit();
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Tenrai API error: ${res.status} for ${endpoint}`);
    }
    return res.json();
  }

  // ============================================================
  // Anime endpoints
  // ============================================================

  async getAnimeFull(id: number) {
    return this.get<{ data: Record<string, unknown> }>(`/anime/${id}/full`);
  }

  async getAnimeById(id: number) {
    return this.get<{ data: Record<string, unknown> }>(`/anime/${id}`);
  }

  async getAnimeCharacters(id: number) {
    return this.get<{ data: Record<string, unknown>[] }>(`/anime/${id}/characters`);
  }

  async getAnimeRecommendations(id: number) {
    return this.get<{ data: Record<string, unknown>[] }>(`/anime/${id}/recommendations`);
  }

  async getAnimeEpisodes(id: number, page = 1) {
    return this.get<{ data: Record<string, unknown>[]; pagination: Record<string, unknown> }>(
      `/anime/${id}/episodes?page=${page}`
    );
  }

  async searchAnime(query: string, page = 1, limit = 24) {
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(
      `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&order_by=popularity&sort=desc`
    );
  }

  async getTopAnime(filter?: string, page = 1, limit = 15) {
    const filterParam = filter ? `&filter=${filter}` : "";
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(`/top/anime?page=${page}&limit=${limit}${filterParam}`);
  }

  async getSeasonalAnime(year: number, season: string, page = 1, limit = 15) {
    return this.get<{
      data: Record<string, unknown>[];
      pagination: Record<string, unknown>;
    }>(`/seasons/${year}/${season}?page=${page}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient(TENRAI_BASE);