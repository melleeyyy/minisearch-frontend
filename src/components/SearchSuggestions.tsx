import { SearchIcon } from "./icons";

interface SearchSuggestionsProps {
  suggestions: string[];
  onPick: (q: string) => void;
}

export default function SearchSuggestions({
  suggestions,
  onPick,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;
  return (
    <ul className="suggestions" role="listbox" aria-label="Search suggestions">
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
