import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchSuggestions from "../components/SearchSuggestions";
import SearchTabs from "../components/SearchTabs";
import SearchResults from "../components/SearchResults";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { search, type SearchResponse } from "../services/searchApi";
import { ApiError } from "../services/api";
import { useSuggestions } from "../hooks/useSuggestions";
import { useSearchHistory } from "../hooks/useSearchHistory";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [input, setInput] = useState(q);
  const [focused, setFocused] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const suggestions = useSuggestions(input, focused && input.trim().length >= 2);
  const { add: addToHistory } = useSearchHistory();

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    if (!q) {
      setData(null);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    search(q, page, 10)
      .then((res) => {
        if (!alive) return;
        setData(res);
        if (page === 1 && res.results.length > 0) addToHistory(q);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setError(
          err instanceof ApiError ? err.message : "Unexpected error. Please retry."
        );
        setData(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [q, page, nonce, addToHistory]);

  const submit = useCallback(
    (query: string) => {
      setFocused(false);
      setParams({ q: query, page: "1" });
    },
    [setParams]
  );

  const goPage = useCallback(
    (p: number) => {
      setParams({ q, page: String(p) });
      window.scrollTo(0, 0);
    },
    [q, setParams]
  );

  return (
    <div>
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-row">
            <Logo size="sm" linked />
            <div onBlur={() => setFocused(false)}>
              <SearchBar
                value={input}
                onChange={setInput}
                onSubmit={submit}
                size="sm"
              />
              {focused && suggestions.length > 0 && (
                <SearchSuggestions suggestions={suggestions} onPick={submit} />
              )}
            </div>
          </div>
          <div onFocus={() => setFocused(true)}>
            <SearchTabs q={q} active="web" />
          </div>
        </div>
      </header>

      <div className="container">
        {!q && (
          <EmptyState
            title="Search MiniSearch"
            message="Type a query above — try കേരളം, search engine, or ISRO."
          />
        )}

        {q && loading && <Loading label="Searching..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.results.length === 0 && (
          <EmptyState
            title="No results found"
            message={
              data.did_you_mean
                ? `No pages matched “${q}”. Did you mean “${data.did_you_mean}”?`
                : `No pages matched “${q}”. The crawl is focused — try a different or broader query.`
            }
          />
        )}
        {q && !loading && !error && data && data.results.length > 0 && (
          <SearchResults data={data} onPage={goPage} />
        )}
      </div>
    </div>
  );
}
