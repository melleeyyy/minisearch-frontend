import { useEffect, useState } from "react";
import { suggest } from "../services/searchApi";
import { useDebounce } from "./useDebounce";

/** Debounced autocomplete for the current query. */
export function useSuggestions(q: string, enabled: boolean): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounced = useDebounce(q.trim(), 220);

  useEffect(() => {
    if (!enabled || debounced.length < 2) {
      setSuggestions([]);
      return;
    }
    let alive = true;
    suggest(debounced)
      .then((r) => {
        if (alive) setSuggestions(r.suggestions ?? []);
      })
      .catch(() => {
        if (alive) setSuggestions([]);
      });
    return () => {
      alive = false;
    };
  }, [debounced, enabled]);

  return suggestions;
}
