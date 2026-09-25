/** Video search — server-side Wikimedia Commons proxy. */
import { request } from "./api";

export interface VideoResultItem {
  title: string;
  url: string;
  poster: string;
  page: string;
  mime: string;
}

export interface VideoResponse {
  query: string;
  page: number;
  limit: number;
  total: number;
  results: VideoResultItem[];
}

export function searchVideos(
  q: string,
  page = 1,
  limit = 12
): Promise<VideoResponse> {
  return request<VideoResponse>("/api/videos", { q, page, limit });
}
