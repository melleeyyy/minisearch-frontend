import { useState } from "react";
import type { NewsCluster } from "../services/knowledgeApi";
import { cleanSnippetText } from "../utils/sanitize";

function timeAgo(iso: string): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const h = ms / 3_600_000;
  if (h < 1) return "just now";
  if (h < 24) return `${Math.round(h)} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

/** V3.8 — one clustered news story with corroboration badge. */
export default function NewsCard({ cluster }: { cluster: NewsCluster }) {
  const [open, setOpen] = useState(false);
  const [top, ...rest] = cluster.items;
  if (!top) return null;
  return (
    <article className="news-card">
      <div className="news-card-badges">
        {cluster.reportedBy > 1 && (
          <span className="news-badge">
            reported by {cluster.reportedBy} sources
          </span>
        )}
        {cluster.published && (
          <span className="news-time">{timeAgo(cluster.published)}</span>
        )}
      </div>
      <h3 className="news-title">
        <a href={top.url} target="_blank" rel="noreferrer">{top.title}</a>
      </h3>
      <p className="news-source">{top.source}</p>
      {top.summary && (
        <p className="news-summary">{cleanSnippetText(top.summary)}</p>
      )}
      {rest.length > 0 && (
        <div className="news-rest">
          <button
            type="button"
            className="news-more"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open
              ? "Hide other sources"
              : `+ ${rest.length} more source${rest.length > 1 ? "s" : ""}`}
          </button>
          {open && (
            <ul className="news-rest-list">
              {rest.map((it) => (
                <li key={it.url}>
                  <a href={it.url} target="_blank" rel="noreferrer">{it.title}</a>
                  <span className="news-rest-source"> — {it.source}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
