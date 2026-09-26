import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import ResearchCard from "../components/ResearchCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getResearch, type ResearchResponse } from "../services/knowledgeApi";
import { ApiError } from "../services/api";

/** V3.8 — Research tab: merged arXiv / PubMed / Crossref / OpenAlex. */
export default function Research() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [data, setData] = useState<ResearchResponse | null>(null);
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
    getResearch(q)
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
          <SearchTabs q={q} active="research" />
        </div>
      </header>

      <div className="container">
        {!q && (
          <EmptyState
            title="Research"
            message="Search across arXiv, PubMed, Crossref and OpenAlex — free scholarly sources."
          />
        )}
        {q && loading && <Loading label="Searching papers..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.results.length === 0 && (
          <EmptyState
            title="No papers found"
            message={`No scholarly results matched “${q}”.`}
          />
        )}
        {q && !loading && !error && data && data.results.length > 0 && (
          <div className="research-list">
            {data.results.map((r, i) => (
              <ResearchCard key={`${r.url}-${i}`} item={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
