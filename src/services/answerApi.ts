/** Extractive answer engine (no LLM). */
import { request } from "./api";

export interface Citation {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  checked?: string;
}

export interface AnswerSource {
  title: string;
  url: string;
}

export interface EvidenceRow {
  title: string;
  url: string;
  domain: string;
  date: string;
  snippet: string;
}

export interface AnswerResponse {
  ok: boolean;
  query: string;
  isQuestion?: boolean;
  answer?: string;
  confidence?: number;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceChecked?: string;
  entityFact?: boolean;
  citations?: Citation[];
  conflicting?: boolean;
  conflictDetail?: string;
  sources?: AnswerSource[];
  evidence?: EvidenceRow[];
  evidenceCount?: number;
}

export function getAnswer(q: string): Promise<AnswerResponse> {
  return request<AnswerResponse>("/api/answer", { q });
}
