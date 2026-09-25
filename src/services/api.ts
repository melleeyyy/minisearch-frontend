/** Core API client + engine status / meta endpoints. */
import { API_BASE, API_TIMEOUT_MS } from "../config";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type QueryParams = Record<string, string | number | undefined>;

export async function request<T>(
  path: string,
  params: QueryParams = {},
  timeoutMs: number = API_TIMEOUT_MS
): Promise<T> {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body: unknown = await res.json();
        if (
          body &&
          typeof body === "object" &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
        ) {
          message = (body as { error: string }).error;
        }
      } catch {
        /* body was not JSON */
      }
      throw new ApiError(res.status, message);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, "Request timed out. The service may be waking up — please retry.");
    }
    throw new ApiError(0, "Could not reach the MiniSearch API.");
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- engine meta ---------- */

export interface Health {
  ok: boolean;
  indexLoaded: boolean;
  pages: number;
  images: number;
  terms: number;
  linkEdges: number;
  cppAcceleration: boolean;
}

export interface IndexedSource {
  domain: string;
  pages: number;
  last_crawled: string | number | null;
}

export interface SourcesResponse {
  sources: IndexedSource[];
  total: number;
  pages: number;
  images: number;
  links: number;
  terms: number;
}

export interface IndexStats {
  pages: number;
  images: number;
  terms: number;
  linkEdges: number;
  cppAcceleration: boolean;
}

export interface Analytics {
  queries?: number;
  topQueries?: string[];
  zeroResultQueries?: string[];
  avgResponseMs?: number;
  p50ResponseMs?: number;
  p95ResponseMs?: number;
  cacheHitRate?: number;
}

export interface StatsResponse {
  index: IndexStats;
  analytics: Analytics;
}

export const getHealth = () => request<Health>("/health");
export const getStats = () => request<StatsResponse>("/api/stats");
export const getSources = () => request<SourcesResponse>("/api/sources");
