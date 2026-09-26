/** V3 knowledge APIs: entity cards, place cards, news, research. */
import { request } from "./api";

/* ---------- entity / place cards ---------- */

export interface EntityCardImage {
  title: string;
  page_url: string;
  image_url: string;
  thumb_url: string;
  width: number;
  height: number;
  mime: string;
  artist: string;
  credit: string;
  license: string;
  license_url: string;
  attribution_required: boolean;
}

export interface MonthlyNormal {
  month: string;
  tmax: number | null;
  tmin: number | null;
  prcp: number | null;
}

export interface PlaceInfo {
  lat: number | null;
  lon: number | null;
  country: string;
  admin1: string;
  district: string;
  hierarchy: { qid: string; label: string }[];
  flagUrl: string;
  weather: { monthly: MonthlyNormal[]; fetchedAt: string } | null;
}

export interface EntityCard {
  entity: {
    qid: string;
    type: "place" | "person" | "landmark" | "org" | "topic";
    labels: Record<string, string>;
    description: string;
    aliases: [string, string][];
    last_checked: string;
  };
  title: string;
  subtitle: string;
  overview: string;
  url: string;
  image: string;
  facts: Record<string, unknown>;
  images: EntityCardImage[];
  related: { qid: string; label: string }[];
  place?: PlaceInfo;
  sources: { name: string; url: string; checked: string }[];
}

export function getEntityCard(
  q: string,
  lang?: string
): Promise<{ entity: EntityCard | null }> {
  return request<{ entity: EntityCard | null }>("/api/entity", {
    q,
    ...(lang ? { lang } : {}),
  });
}

export function getPlaceCard(
  q: string,
  lang?: string
): Promise<{ place: EntityCard | null }> {
  return request<{ place: EntityCard | null }>("/api/place", {
    q,
    ...(lang ? { lang } : {}),
  });
}

/* ---------- news (V3.5) ---------- */

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  authority: number;
  published: string;
  summary: string;
  score: number;
}

export interface NewsCluster {
  id: string;
  reportedBy: number;
  sources: string[];
  published: string;
  items: NewsItem[];
}

export interface NewsResponse {
  query: string;
  lang: string;
  totalItems: number;
  clusters: NewsCluster[];
  fetchedAt: string;
}

export function getNews(
  q: string,
  lang = "en",
  limit = 12
): Promise<NewsResponse> {
  return request<NewsResponse>("/api/news", { q, lang, limit });
}

/* ---------- research (V3.7) ---------- */

export interface ResearchItem {
  source: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  url: string;
  doi: string;
  abstract: string;
  cited_by: number;
  score: number;
}

export interface ResearchResponse {
  query: string;
  results: ResearchItem[];
  sources_used: string[];
}

export function getResearch(
  q: string,
  sources?: string[],
  limit = 12
): Promise<ResearchResponse> {
  return request<ResearchResponse>("/api/research", {
    q,
    limit,
    ...(sources && sources.length ? { sources: sources.join(",") } : {}),
  });
}
