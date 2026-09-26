import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import NewsCard from "../components/NewsCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getNews, type NewsResponse } from "../services/knowledgeApi";
import { ApiError } from "../services/api";

/** V3.8 — News tab: clustered, deduplicated news for a query. */
export default function News() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => setInput(q), [q]);

  useEffect(() => {
    if (!q) {
      setData(null);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    getNews(q)
      .then((res) => {
        if (alive) setData(res);
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
  }, [q, nonce]);

  const submit = useCallback(
    (query: string) => setParams({ q: query, page: "1" }),
    [setParams]
  );

  return (
    <div>
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-row">
            <Logo size="sm" linked />
            <SearchBar value={input} onChange={setInput} onSubmit={submit} size="sm" />
          </div>
          <SearchTabs q={q} active="news" />
        </div>
      </header>

      <div className="container">
        {!q && (
          <EmptyState
            title="News"
            message="Search a topic to see clustered news — try Kerala, ISRO or monsoon."
          />
        )}
        {q && loading && <Loading label="Loading news..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.clusters.length === 0 && (
          <EmptyState
            title="No news found"
            message={`No recent stories matched “${q}”.`}
          />
        )}
        {q && !loading && !error && data && data.clusters.length > 0 && (
          <div className="news-list">
            {data.clusters.map((c) => (
              <NewsCard key={c.id} cluster={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
