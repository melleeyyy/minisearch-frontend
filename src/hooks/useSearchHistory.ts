import { useCallback, useEffect, useState } from "react";

export interface HistoryEntry {
  q: string;
  ts: number;
}

const KEY = "minisearch.history";
const MAX = 50;

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is HistoryEntry =>
        !!e && typeof e === "object" && typeof (e as HistoryEntry).q === "string"
    );
  } catch {
    return [];
  }
}

export function useSearchHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(load());
  }, []);

  const add = useCallback((q: string) => {
    const query = q.trim();
    if (!query) return;
    setEntries((prev) => {
      const next = [
        { q: query, ts: Date.now() },
        ...prev.filter((e) => e.q.toLowerCase() !== query.toLowerCase()),
      ].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { entries, add, clear };
}
