import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import SearchTabs from "../components/SearchTabs";
import ImageCard from "../components/ImageCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { searchImages, type ImageResponse } from "../services/imageApi";
import { ApiError } from "../services/api";
import { formatNumber } from "../utils/format";

export default function Images() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [input, setInput] = useState(q);
  const [data, setData] = useState<ImageResponse | null>(null);
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
    searchImages(q, page, 24)
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
          <SearchTabs q={q} active="images" />
        </div>
      </header>

      <div className="container container-wide">
        {!q && (
          <EmptyState
            title="Image search"
            message="Search images indexed from crawled pages. Try kerala, kochi or rocket."
          />
        )}
        {q && loading && <Loading label="Searching images..." />}
        {q && !loading && error && (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        )}
        {q && !loading && !error && data && data.results.length === 0 && (
          <EmptyState
            title="No images found"
            message={`No indexed images matched “${q}”. Images are never re-hosted — only indexed with a link to the original.`}
          />
        )}
        {q && !loading && !error && data && data.results.length > 0 && (
          <>
            <p className="result-count">
              About {formatNumber(data.total)} image{data.total === 1 ? "" : "s"} for “{q}”
            </p>
            <div className="media-grid">
              {data.results.map((img) => (
                <ImageCard key={img.imageUrl} item={img} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Image pages">
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
