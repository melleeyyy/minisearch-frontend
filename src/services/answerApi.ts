/** Extractive answer engine (no LLM). */
import { request } from "./api";

export interface Citation {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface AnswerSource {
  title: string;
  url: string;
}

export interface AnswerResponse {
  ok: boolean;
  query: string;
  isQuestion?: boolean;
  answer?: string;
  confidence?: number;
  sourceUrl?: string;
  sourceTitle?: string;
  citations?: Citation[];
  conflicting?: boolean;
  conflictDetail?: string;
  sources?: AnswerSource[];
}

export function getAnswer(q: string): Promise<AnswerResponse> {
  return request<AnswerResponse>("/api/answer", { q });
}
