import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import VideoCard from "../components/VideoCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { searchVideos, type VideoResponse } from "../services/videoApi";
import { ApiError } from "../services/api";
import { formatNumber } from "../utils/format";

export default function Videos() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [input, setInput] = useState(q);
  const [data, setData] = useState<VideoResponse | null>(null);
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
    searchVideos(q, page, 12)
      .then((res) => alive && setData(res))
      .catch((err: unknown) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "Unexpected error.");
        setData(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [q, page, nonce]);

  const submit = useCallback(
    (query: string) => setParams({ q: query, page: "1" }),
    [setParams]
  );

  const goPage = useCallback(
    (p: number) => {
      setParams({ q, page: String(p) });
      window.scrollTo(0, 0);
    },
    [q, setParams]
  );

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div>
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-row">
            <Logo size="sm" linked />
            <SearchBar value={input} onChange={setInput} onSubmit={submit} size="sm" />
          </div>
          <SearchTabs q={q} active="videos" />
        </div>
      </header>

      <div className="container container-wide">
        {!q && (
          <EmptyState
            title="Video search"
            message="Videos are fetched live from Wikimedia Commons. Try kerala, launch or rocket."
          />
        )}
        {q && loading && <Loading label="Searching videos..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.results.length === 0 && (
          <EmptyState
            title="No videos found"
            message={`No Commons videos matched “${q}”.`}
          />
        )}
        {q && !loading && !error && data && data.results.length > 0 && (
          <>
            <p className="result-count">
              About {formatNumber(data.total)} video{data.total === 1 ? "" : "s"} for “{q}”
            </p>
            <div className="media-grid media-grid-videos">
              {data.results.map((v) => (
                <VideoCard key={v.url} item={v} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Video pages">
                <button
                  className="page-btn"
                  disabled={page <= 1}
                  onClick={() => goPage(page - 1)}
                >
                  ‹ Prev
                </button>
                <span className="page-btn current">{page}</span>
                <button
                  className="page-btn"
                  disabled={page >= totalPages}
                  onClick={() => goPage(page + 1)}
                >
                  Next ›
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
