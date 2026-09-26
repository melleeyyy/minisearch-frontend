import { useEffect, useRef, useState } from "react";
import { getEntityCard, type EntityCard } from "../services/knowledgeApi";
import { useDebounce } from "./useDebounce";

/**
 * V3.8 — debounced entity lookup for the autocomplete shortcut row.
 * Returns null while loading / when no entity matches.
 */
export function useEntityPreview(q: string, enabled: boolean): EntityCard | null {
  const [card, setCard] = useState<EntityCard | null>(null);
  const debounced = useDebounce(q.trim(), 320);
  const lastRef = useRef("");

  useEffect(() => {
    if (!enabled || debounced.length < 3) {
      setCard(null);
      lastRef.current = "";
      return;
    }
    if (debounced === lastRef.current) return;
    let alive = true;
    lastRef.current = debounced;
    getEntityCard(debounced)
      .then((r) => {
        if (alive) setCard(r.entity ?? null);
      })
      .catch(() => {
        if (alive) setCard(null);
      });
    return () => {
      alive = false;
    };
  }, [debounced, enabled]);

  return card;
}
