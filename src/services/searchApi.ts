/** Web search + autocomplete. */
import { request } from "./api";

export interface SearchResultItem {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  score: number;
  domain: string;
  language: string;
  crawledAt: string;
}

export interface SearchResponse {
  query: string;
  page: number;
  limit: number;
  cache: boolean;
  total: number;
  results: SearchResultItem[];
  did_you_mean?: string;
}

export function search(q: string, page = 1, limit = 10): Promise<SearchResponse> {
  return request<SearchResponse>("/api/search", { q, page, limit });
}

export function suggest(q: string): Promise<{ suggestions: string[] }> {
  return request<{ suggestions: string[] }>("/api/suggest", { q });
}
