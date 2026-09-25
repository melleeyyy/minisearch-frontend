/** Image search over MiniSearch's own image index. */
import { request } from "./api";

export interface ImageResultItem {
  imageUrl: string;
  sourcePageUrl: string;
  domain: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export interface ImageResponse {
  query: string;
  page: number;
  limit: number;
  total: number;
  results: ImageResultItem[];
}

export function searchImages(
  q: string,
  page = 1,
  limit = 24
): Promise<ImageResponse> {
  return request<ImageResponse>("/api/images", { q, page, limit });
}
