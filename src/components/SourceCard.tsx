import type { IndexedSource } from "../services/api";
import { formatNumber, timeAgo } from "../utils/format";

export default function SourceCard({ source }: { source: IndexedSource }) {
  return (
    <div className="card-row">
      <span className="k">
        <span className="domain-tag" title={source.domain}>
          {source.domain}
        </span>
      </span>
      <span>
        {formatNumber(source.pages)} page{source.pages === 1 ? "" : "s"}
        {source.last_crawled ? ` · crawled ${timeAgo(source.last_crawled)}` : ""}
      </span>
    </div>
  );
}
