import { FormEvent, useRef } from "react";
import { SEARCH_PLACEHOLDER } from "../config";

interface SearchBarProps {
  value: string;
  onChange: (q: string) => void;
  onSubmit: (q: string) => void;
  size?: "lg" | "sm";
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  size = "sm",
  placeholder = SEARCH_PLACEHOLDER,
  autoFocus = false,
  name = "q",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) onSubmit(q);
    inputRef.current?.blur();
  }

  return (
    <form
      className={`searchbar searchbar-${size}`}
      role="search"
      onSubmit={submit}
    >
      <div className="searchbar-box">
        <input
          ref={inputRef}
          className="searchbar-input"
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-label="Search query"
          onChange={(e) => onChange(e.target.value)}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="searchbar-clear"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <button type="submit" className="searchbar-submit" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20l-3.8-3.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
