import { SearchIcon } from "./icons";
import type { EntityCard } from "../services/knowledgeApi";

interface SearchSuggestionsProps {
  suggestions: string[];
  onPick: (q: string) => void;
  entity?: EntityCard | null;
}

/**
 * V3.8 — autocomplete list with an optional entity shortcut row at the
 * top (thumbnail + "label — description"), like the reference UI.
 */
export default function SearchSuggestions({
  suggestions,
  onPick,
  entity,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0 && !entity) return null;
  const thumb = entity?.images?.[0]?.thumb_url || entity?.image || "";
  return (
    <ul className="suggestions" role="listbox" aria-label="Search suggestions">
      {entity && (
        <li
          className="suggestion-item suggestion-entity"
          role="option"
          aria-selected={false}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(entity.title);
          }}
          onClick={() => onPick(entity.title)}
        >
          {thumb ? (
            <img className="suggestion-thumb" src={thumb} alt="" loading="lazy" />
          ) : (
            <span className="suggestion-icon"><SearchIcon size={16} /></span>
          )}
          <span className="suggestion-entity-text">
            <span className="suggestion-entity-title">{entity.title}</span>
            <span className="suggestion-entity-sub">{entity.subtitle}</span>
          </span>
        </li>
      )}
      {suggestions.slice(0, 8).map((s) => (
        <li
          key={s}
          className="suggestion-item"
          role="option"
          aria-selected={false}
          onMouseDown={(e) => {
            e.preventDefault(); // keep the input from losing focus first
            onPick(s);
          }}
          onClick={() => onPick(s)}
        >
          <span className="suggestion-icon">
            <SearchIcon size={16} />
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}
