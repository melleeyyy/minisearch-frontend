import { Link } from "react-router-dom";
import type { SearchResponse } from "../services/searchApi";
import { formatNumber } from "../utils/format";
import SearchResult from "./SearchResult";

interface SearchResultsProps {
  data: SearchResponse;
  onPage: (page: number) => void;
}

function pageList(current: number, total: number, limit: number): number[] {
  const last = Math.max(1, Math.ceil(total / limit));
  const start = Math.max(1, Math.min(current - 2, last - 4));
  const end = Math.min(last, start + 4);
  const out: number[] = [];
  for (let p = start; p <= end; p++) out.push(p);
  return out;
}

export default function SearchResults({ data, onPage }: SearchResultsProps) {
  const { results, total, page, limit, did_you_mean: dym, query } = data;

  return (
    <div>
      {dym && (
        <p className="did-you-mean">
          Did you mean{" "}
          <Link
            to={`/search?q=${encodeURIComponent(dym)}`}
            onClick={() => onPage(1)}
          >
            {dym}
          </Link>
          ?
        </p>
      )}

      <p className="result-count">
        About {formatNumber(total)} result{total === 1 ? "" : "s"} for “{query}”
      </p>

      <div>
        {results.map((r) => (
          <SearchResult key={r.url} item={r} />
        ))}
      </div>

      {total > limit && (
        <nav className="pagination" aria-label="Search result pages">
          <button
            className="page-btn"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            ‹ Prev
          </button>
          {pageList(page, total, limit).map((p) => (
            <button
              key={p}
              className={`page-btn${p === page ? " current" : ""}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={page * limit >= total}
            onClick={() => onPage(page + 1)}
          >
            Next ›
          </button>
        </nav>
      )}
    </div>
  );
}
